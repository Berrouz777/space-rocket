import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: ['./app/**/*.{vue,js,ts}'],
    theme: {
        container: {
            center: true,
            padding: '1rem'
        },
        extend: {
            colors: {
                // Custom colors
                // screen: { dark: '#000', light: '#BBC8B5' },
                // scrollbar: { track: '#585858', thumb: '#BBC8B5' }
            },
            fontFamily: {
                sans: ['Apex Mk3', 'system-ui', 'ui-sans-serif', 'sans-serif'],
                abeezee: ['ABeeZee', 'system-ui', 'ui-sans-serif', 'sans-serif']
            },
            fontSize: {
                'game-2xs': ['clamp(4px, 2cqw, 16px)', { lineHeight: '1' }],
                'game-xs': ['clamp(6px, 2.5cqw, 20px)', { lineHeight: '1' }],
                'game-sm': ['clamp(8px, 3.5cqw, 24px)', { lineHeight: '1' }],
                'game-base': ['clamp(9px, 4.5cqw, 28px)', { lineHeight: '1' }],
                'game-lg': ['clamp(10px, 5.5cqw, 32px)', { lineHeight: '1' }],
                'game-xl': ['clamp(12px, 6.5cqw, 40px)', { lineHeight: '1' }],
                'game-2xl': ['clamp(14px, 8cqw, 48px)', { lineHeight: '1' }],
                'game-3xl': ['clamp(16px, 8.5cqw, 56px)', { lineHeight: '1' }],
                'game-4xl': ['clamp(20px, 10.5cqw, 64px)', { lineHeight: '1' }],
                'game-5xl': ['clamp(28px, 14.5cqw, 80px)', { lineHeight: '1' }],
                'game-6xl': ['clamp(32px, 16.5cqw, 96px)', { lineHeight: '1' }]
            }
            // Custom border colors and other options
            //borderColor: { button: '#BBC8B5' },
            //borderRadius: { xl: '1rem' },

            // Custom background colors
            // backgroundColor: {
            //     button: { active: '#BBC8B5', inactive: '#000' }
            // }
        }
    }
}
