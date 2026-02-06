// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            meta: [
                { name: 'referrer', content: 'strict-origin-when-cross-origin' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no' }
            ],
            link: [
                { rel: 'shortcut icon', href: '/static/favicon.ico?v=a9L4ouZJif' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/static/apple-touch-icon.png?v=a9L4ouZJif' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/static/favicon-32x32.png?v=a9L4ouZJif' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/static/favicon-16x16.png?v=a9L4ouZJif' },
                { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/static/favicon-96x96.png?v=a9L4ouZJif' }
            ]
        }
    },
    runtimeConfig: {
        public: {
            apiBase: import.meta.env.NUXT_PUBLIC_API_BASE || ''
        }
    },
    css: ['~/assets/css/tailwind.css'],
    eslint: {
        config: {
            standalone: true
        }
    },
    fonts: {
        families: [
            // {
            //     name: 'TikTok Sans',
            //     display: 'swap',
            //     preload: true,
            //     provider: 'google',
            //     fallbacks: ['sans-serif'],
            //     weights: [700]
            // }
        ]
    },
    modules: [
        '@nuxt/fonts',
        '@pinia/nuxt',
        '@nuxt/eslint',
        '@nuxtjs/i18n',
        '@nuxtjs/device',
        '@nuxtjs/tailwindcss',
        '@artmizu/yandex-metrika-nuxt',
        'pinia-plugin-persistedstate/nuxt',
        //'@vite-pwa/nuxt',
        'nuxt-toast',
        'nuxt-vite-legacy'
    ],
    devtools: { enabled: true },
    typescript: {
        shim: false,
        strict: true
    },
    i18n: {
        locales: [
            { code: 'ru', isoCode: 'ru-RU', name: 'Русский', file: 'ru.json' },
            { code: 'en', isoCode: 'en-US', name: 'English', file: 'en.json' }
        ],
        strategy: 'no_prefix',
        defaultLocale: 'en',
        detectBrowserLanguage: false
    },
    tailwindcss: {
        viewer: false,
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config',
        exposeConfig: true
    },
    piniaPluginPersistedstate: {
        storage: 'localStorage'
    },
    yandexMetrika: {
        useCDN: false,
        initParams: {
            clickmap: true,
            webvisor: true,
            trackLinks: true,
            triggerEvent: true,
            accurateTrackBounce: true
        }
    },
    // pwa: {
    //     srcDir: '../public',
    //     filename: 'sw.js',
    //     manifest: {
    //         name: 'Winnery Game',
    //         lang: 'ru',
    //         icons: [],
    //         short_name: 'Winnery Game',
    //         description: 'description',
    //         theme_color: '#ffffff'
    //     },
    //     strategies: 'injectManifest',
    //     registerType: 'autoUpdate',
    //     useCredentials: true,
    //     injectRegister: false,
    //     injectManifest: {
    //         globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    //         injectionPoint: undefined
    //     }
    // },
    legacy: {
        targets: [
            '> 0.3%', // Browsers with more than 0.3% global usage
            'not dead', // Excludes outdated, unsupported browsers (e.g. IE 10,Opera Mini)
            'last 2 versions', // Covers the last 2 major versions of each browser
            'Firefox ESR', // Enterprise-supported Firefox (long-term support release)
            'Safari >= 10', // Includes Safari 10+ (for older macOS + LG Smart TVs with webOS 3.x+)
            'Samsung >= 5', // Samsung Internet 5+ (Tizen Smart TVs 2017+ and Samsung Android devices)
            'ios_saf >= 11', // iOS Safari 11+ (covers all browsers on iOS due toWebKit restriction)
            'Chrome >= 53' // Chrome 53+ (used on older Android TVs, Tizendevices, Chromium-based browsers)
        ],
        polyfills: true, // Automatically include polyfills based on target browsers
        modernPolyfills: true, // Only inject necessary polyfills into the legacybundle
        renderLegacyChunks: true, // Generate separate legacy chunks with fallback script tags
        additionalLegacyPolyfills: [
            'regenerator-runtime/runtime' // Required if you use async/await inlegacy-compatible code
        ]
    },
    compatibilityDate: '2025-07-15'
})
