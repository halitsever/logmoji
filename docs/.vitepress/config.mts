import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const siteUrl = 'https://halitsever.github.io/logmoji/'
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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title,
  description,
  head: [
    ['link', { rel: 'icon', href: '/logmoji/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
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
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: url }], ['meta', { property: 'og:url', content: url }])
  },
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Halit Sever'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/usage' }
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Usage', link: '/usage' },
          { text: 'Config', link: '/config' }
        ]
      }
    ],

    logo: '/favicon.png',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/halitsever/logmoji' }
    ]
  }
})
