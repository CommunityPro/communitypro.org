import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		fontFamily: {
			base: ["Trueno", "sans-serif"],
			secondary: ["Prima Nova", "sans-serif"],
		},
		extend: {
			backgroundImage: {
				"community-1": "url('/assets/images/community-1.webp')",
				"community-2": "url('/assets/images/community-2.webp')",
				"community-3": "url('/assets/images/community-3.webp')",
				"flat-map": "url('/assets/images/flat-map.webp')",
				hands: "url('/assets/images/hands.png')",
				"round-map": "url('/assets/images/round-map.webp')",
			},
			colors: {
				"text-black": "#0f1f2e",
				"text-gray": "#707070",
				"text-gray-light": "#e5e5e5",
				"text-white": "#ffffff",
				primary: {
					"100": "#ffcd42",
					"200": "#ffdc7B",
					"300": "#ffe5a0",
					"400": "#fffaed",
				},
				secondary: "#000000",
				"soft-white": "#f7f4f0",
				"soft-black": "#0b0a0d",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
