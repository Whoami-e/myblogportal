export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'myblogportal',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/icons/iconfont.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '@/plugins/element-ui',
      ssr: true
    },
    {
      src: '@/plugins/wordcloud',
      ssr: false
    },
    {
      src: '@/plugins/dateformat',
      ssr: true
    },
    {
      src: '@/plugins/canvasNest',
      ssr: false
    },
    {
      src: '@/plugins/VueParticles',
      ssr: false
    },
    {
      src: '@/plugins/baiduGa',
      ssr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy:{
    '/user/': {
      target: 'http://192.168.26.192:8080'
    },
    '/portal': {
      target: 'http://192.168.26.192:8080'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  }

}
