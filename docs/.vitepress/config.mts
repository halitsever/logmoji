import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const siteUrl = 'https://projects.halit.org/logmoji/'
const title = 'Logmoji'
const description = 'Node.js logger that prints each line with an emoji, log levels, console log colors, timestamps and context loggers.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'logmoji',
  description,
  url: siteUrl,
  codeRepository: 'https://github.com/halitsever/logmoji',
  programmingLanguage: 'JavaScript',
  runtimePlatform: 'Node.js',
  license: 'https://opensource.org/licenses/MIT',
  author: { '@type': 'Person', name: 'Halit Sever', url: 'https://github.com/halitsever' }
}

/** BlogPosting, breadcrumbs and, when the post shows an FAQ, FAQPage data for a blog post. */
function postJsonLd(fm: Record<string, any>, url: string) {
  const person = { '@type': 'Person', name: 'Halit Sever', url: 'https://halit.org' }
  const graph: object[] = [
    {
      '@type': 'BlogPosting',
      headline: fm.headline ?? fm.title,
      description: fm.description,
      url,
      mainEntityOfPage: url,
      datePublished: fm.date,
      dateModified: fm.date,
      inLanguage: 'en',
      image: `${siteUrl}og.png`,
      keywords: fm.keyword,
      author: person,
      publisher: person
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Logmoji', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}blog/` },
        { '@type': 'ListItem', position: 3, name: fm.headline ?? fm.title, item: url }
      ]
    }
  ]
  if (fm.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: fm.faq.map((f: { q: string; a: string }) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>|`/g, '') }
      }))
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  /** keeps the page hash map out of every page's HTML, which Semrush reads as a low text-to-HTML ratio */
  metaChunk: true,
  lang: 'en-US',
  title,
  description,
  head: [
    /** Cloudflare Web Analytics, one token for every page on projects.halit.org. */
    ['script', { defer: '', src: 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "dd7e54d3f48841c187d72d9dbb92a6b6"}' }],
    ['link', { rel: 'icon', href: '/logmoji/favicon.ico' }],
    ['meta', { property: 'og:image', content: `${siteUrl}og.png` }],
    ['meta', { property: 'og:image:width', content: '1280' }],
    ['meta', { property: 'og:image:height', content: '640' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)]
  ],
  base: '/logmoji/',
  sitemap: { hostname: siteUrl },
  transformPageData(pageData) {
    if (pageData.isNotFound) return
    if (pageData.relativePath === 'index.md') pageData.frontmatter.hero.tagline = version
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    const url = `${siteUrl}${path}`
    const fm = pageData.frontmatter
    const pageTitle = fm.titleTemplate === false ? fm.title : `${fm.title ?? pageData.title} | ${title}`
    fm.head ??= []
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: fm.description ?? description }]
    )
    if (fm.date) fm.head.push(['script', { type: 'application/ld+json' }, JSON.stringify(postJsonLd(fm, url))])
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Halit Sever'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/usage' },
      { text: 'Color picker', link: '/console-log-colors/' },
      { text: 'Blog', link: '/blog/' }
    ],

    sidebar: {
      '/blog/': [
        {
          text: 'Node.js logging guides',
          items: [
            { text: 'All posts', link: '/blog/' },
            { text: 'Log levels explained', link: '/blog/log-levels-explained' },
            { text: 'Log level hierarchy', link: '/blog/log-level-hierarchy' },
            { text: 'Pino logger', link: '/blog/pino-logger' },
            { text: 'Winston logger', link: '/blog/winston-logger' },
            { text: 'Winston vs pino', link: '/blog/winston-vs-pino' },
            { text: 'Color console.log output', link: '/blog/console-log-colors-node' },
            { text: 'Node.js logging basics', link: '/blog/nodejs-logging-basics' },
            { text: 'Emoji logs', link: '/blog/emoji-console-logs' }
          ]
        }
      ],
      '/': [
        {
          text: 'Docs',
          items: [
            { text: 'Usage', link: '/usage' },
            { text: 'Config', link: '/config' },
            { text: 'Console log colors', link: '/console-log-colors/' }
          ]
        }
      ]
    },

    logo: { src: '/favicon.png', alt: 'Logmoji logo' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/logmoji' }
    ]
  }
})
