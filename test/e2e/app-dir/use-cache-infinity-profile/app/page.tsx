import { cacheLife } from 'next/cache'

// A page using a configured profile with `revalidate: Infinity` and
// `expire: Infinity`. It must be prerenderable at build time; there is
// deliberately no Suspense boundary, so if the profile degrades to a dynamic
// cache life, the build fails with "accessed data at request time".
export default async function Page() {
  'use cache'
  cacheLife('frozen')

  return <p id="value">{crypto.randomUUID()}</p>
}
