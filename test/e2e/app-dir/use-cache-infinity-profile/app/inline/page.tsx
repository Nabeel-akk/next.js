import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

// Same cache life as the configured "frozen" profile, but passed inline. The
// value is keyed on a search param so it is not part of the prerender, and is
// stored and read back through the JSON-backed cache handler (see handler.js)
// at request time.
async function frozenValue(key: string) {
  'use cache'
  cacheLife({ stale: 300, revalidate: Infinity, expire: Infinity })

  return `${key} ${new Date().toISOString()}`
}

async function Value({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key = 'default' } = await searchParams
  return <p id="value">{await frozenValue(key)}</p>
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Value searchParams={searchParams} />
    </Suspense>
  )
}
