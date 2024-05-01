/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            'xs': '400px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
          },
        fontFamily: {
            custom: ["Maven Pro"],
        },
        fontSize: {
            'xs': ['0.75rem', '1rem'],
            'sm': ['0.875rem', '1.25rem'],
            'base': ['1rem', '1.5rem'],
            'lg': ['1.125rem', '1.75rem'],
            'xl': ['1.25rem', '1.75rem'],
            '2xl': ['1.5rem', '2rem'],
            '3xl': ['1.875rem', '2.25rem'],
            '4xl': ['2.25rem', '2.5rem'],
            '5xl': ['3rem', '1'],
            '6xl': ['3.75rem', '1'],
            '7xl': ['4.5rem', '1'],
            '8xl': ['6rem', '1'],
            '9xl': ['8rem', '1']
        },
        extend: {
            colors: {
                "primary-1": {
                    DEFAULT: "#CD0002",
                },
                "primary-2": {
                    DEFAULT: "#0E0E0E",
                },
                "primary-3": {
                    DEFAULT: "#FFFFFF",
                },
                "primary-4": {
                    DEFAULT: "#1D4799",
                },
                "primary-5": {
                    DEFAULT: "#84C22F",
                },
                "primary-6": {
                    DEFAULT: "#605E5F",
                },
                "primary-7": {
                    DEFAULT: "#AA2034",
                },
                "primary-8": {
                    DEFAULT: "#1A142C",
                },
                "primary-9":{
                    DEFAULT: "#32935E",
                },
                "primary-10":{
                    DEFAULT:"#C53B32"
                },
                "primary-11":{
                    DEFAULT:"#202020"
                }
            },
            textShadow: {
                sm: '0 1px 2px var(--tw-shadow-color)',
                DEFAULT: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)',
            },
        },
        // screens: {
        //     'xs': '360px',
        //     'sm': '540px',
        //     'md': '720px',
        //     'lg': '960px',
        //     'xl': '1140px',
        //     '2xl': '1320px',
        //   },      
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            )
        }),
    ],
}
