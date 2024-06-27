import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Logmoji | Documentation",
  description: "🪵 Very small logging package with emojis for node.js",
  head: [['link', { rel: 'icon', href: '/logmoji/favicon.ico' }]],
  base: '/logmoji/',
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
