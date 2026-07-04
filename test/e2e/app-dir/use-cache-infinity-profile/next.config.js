/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: require.resolve('./handler.js'),
  },
  cacheLife: {
    // `Infinity` is the documented value for "never revalidate/expire". The
    // resolved config crosses JSON serialization boundaries (build workers,
    // required-server-files.json), which `Infinity` only survives if it is
    // normalized at config load.
    frozen: { stale: 300, revalidate: Infinity, expire: Infinity },
  },
}

module.exports = nextConfig
