console.log('process.env.CI',process.env.CI)
module.exports = (_ctx) => ({
  sourceDir: 'docs',
  dest: 'docs/dist',
  base: process.env.CI ? '/safepal-docs/' : '/',

  locales: {
    '/Connect-wallet/': {
      lang: 'en-US',
      title: 'SafePal Docs',
      description: 'Developer documentation for SafePal Wallet',
    }
  },

  head: [
    ['link', { rel: 'icon', href: `/sfp.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#7524F9' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` },
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#3eaf7c',
      },
    ],
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/sfp.png',
        color: '#3eaf7c',
        type: 'image/x-icon'
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/msapplication-icon-144x144.png',
      },
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['script', { src:"/js/extend.js" }],
  ],

  theme: '@vuepress/theme-default',

  themeConfig: {
    repo: 'SafePalWallet/docs',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    logo: '/sfp.png',
    smoothScroll: true,
    sidebarDepth:5,
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_INDEX_NAME,
    },
    locales: {
      '/Connect-wallet/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: {
          '/Connect-wallet/': [
            {
              title: 'Guide',
              collapsable: false,
              children: [
                ''
              ]
            },
            {
              title: 'DApp Development',
              collapsable: false,
              children: [
                {
                  title: "Extension Wallet",
                  collapsable: false,
                  children:[
                    "Web/introduction",
                    "Web/quickly",
                    "Web/ethereum",
                    "Web/solana",
                    "Web/tron",
                    "Web/aptos"
                  ]
                },
                {
                  title: "Mobile",
                  collapsable: false,
                  children:[
                    'Mobile/walletconnet',
                    'Mobile/webview-function'
                  ]
                }
              ]
            },
            {
              title: 'Resources',
              collapsable: false,
              children: [
                'resources'
              ]
            }
          ]
        }
      },
    }
  },

  plugins: [
    ['@vuepress/back-to-top', false],
    [
      '@vuepress/pwa',
      {
        serviceWorker: false,
        popupComponent: 'MySWUpdatePopup',
        updatePopup: true,
      },
    ],
    ['@vuepress/medium-zoom', true],
    [
      'container',
      {
        type: 'vue',
        before: '<pre class="vue-container"><code>',
        after: '</code></pre>',
      },
    ],
    [
      'container',
      {
        type: 'upgrade',
        before: (info) => `<UpgradePath title="${info}">`,
        after: '</UpgradePath>',
      },
    ],
    [
      'vuepress-plugin-redirect',
      {
        redirectors: [
          {
            base: '/',
            alternative: '/Connect-wallet',
          }
        ]
      }
    ],
    [
      'tabs',
      {
        useUrlFragment: false,
      },
    ],
    ['vuepress-plugin-code-copy', true]
  ],

  extraWatchFiles: ['.vuepress/nav/en.js'],
  markdown:{
    lineNumbers:true
  }
});
