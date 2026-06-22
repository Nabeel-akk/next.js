import path from 'node:path'
import { constants, promises as fs } from 'node:fs'
import { patchPackageJsonFile } from '../../../scripts/pack-utils/patch-package-json'

const TARBALL_FILES = {
  nextTarball: 'next.tar',
  nextMdxTarball: 'next-mdx.tar',
  nextEnvTarball: 'next-env.tar',
  nextBundleAnalyzerTarball: 'next-bundle-analyzer.tar',
  nextSwcTarball: 'next-swc.tar',
} as const

export function validateDeployableTarballOptions({
  localTarballsDir,
  existingDeployUrl,
  nextTestVersion,
}: {
  localTarballsDir: string | undefined
  existingDeployUrl: string | undefined
  nextTestVersion: string | undefined
}): void {
  if (localTarballsDir && existingDeployUrl) {
    throw new Error(
      'NEXT_TEST_DEPLOY_TARBALLS_DIR cannot be used with NEXT_TEST_DEPLOY_URL'
    )
  }
  if (localTarballsDir && nextTestVersion) {
    throw new Error(
      'NEXT_TEST_DEPLOY_TARBALLS_DIR cannot be used with NEXT_TEST_VERSION'
    )
  }
}

export async function prepareDeployableTarballs(
  sourceDir: string,
  projectDir: string
): Promise<void> {
  const resolvedSourceDir = path.resolve(sourceDir)
  const targetDir = path.join(projectDir, 'tarballs')

  await Promise.all(
    Object.values(TARBALL_FILES).map(async (filename) => {
      const sourceFile = path.join(resolvedSourceDir, filename)
      try {
        await fs.access(sourceFile)
      } catch (cause) {
        throw new Error(
          `Missing local Next.js tarball: ${sourceFile}. Run \`pnpm pack-next --tar\` first.`,
          { cause }
        )
      }
    })
  )

  await fs.mkdir(targetDir, { recursive: true })
  await Promise.all(
    Object.values(TARBALL_FILES).map((filename) =>
      fs.copyFile(
        path.join(resolvedSourceDir, filename),
        path.join(targetDir, filename),
        constants.COPYFILE_FICLONE
      )
    )
  )

  await patchPackageJsonFile(path.join(projectDir, 'package.json'), {
    nextTarball: './tarballs/next.tar',
    nextMdxTarball: './tarballs/next-mdx.tar',
    nextEnvTarball: './tarballs/next-env.tar',
    nextBundleAnalyzerTarball: './tarballs/next-bundle-analyzer.tar',
    nextSwcTarball: './tarballs/next-swc.tar',
  })
}
