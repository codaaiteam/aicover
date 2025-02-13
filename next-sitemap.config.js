/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.mochi1preview.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    const paths = [];
    const languages = ['', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it'];
    const routes = [
      { path: '', priority: 1.0 },
      { path: '/create', priority: 0.9 },
      { path: '/guide', priority: 0.8 },
      { path: '/price', priority: 0.9 },
      { path: '/videos', priority: 0.7 },
      { path: '/terms', priority: 0.5 },
      { path: '/privacy', priority: 0.5 }
    ];

    // 生成所有語言版本的路徑
    for (const lang of languages) {
      for (const route of routes) {
        const prefix = lang ? `/${lang}` : '';
        const priority = lang ? route.priority * 0.9 : route.priority;
        paths.push({
          loc: `${prefix}${route.path}`,
          changefreq: 'daily',
          priority,
          lastmod: new Date().toISOString()
        });
      }
    }

    return paths;
  },
  exclude: [
    '/404',
    '/500',
    '/api/*',
    '/sign-in/*',
    '/sign-up/*',
    '/dashboard/*',
    '/robots.txt',
    '/sitemap*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/sign-in/*', '/sign-up/*', '/dashboard/*']
      }
    ]
  }
}
