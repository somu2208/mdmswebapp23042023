const colors = require('tailwindcss/colors')

module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	mode: 'jit',
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontFamily: {
			openSans: ['Open Sans', 'sans-serif'],
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: '#f49620',
				},
				secondary: {
					DEFAULT: '#242424',
				},
				teal: colors.teal,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('tw-elements/dist/plugin')],
}
