import sitemap from '../app/sitemap'

async function main() {
  const sitemapData = sitemap()
  console.log(JSON.stringify(sitemapData, null, 2))
}

main().catch(console.error)
