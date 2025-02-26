import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
  			mainbackground: '#fffafa',
  			outbackground: '#D5C6C6',
  			'pink-light': '#E4A0A0',
  			'pink-dark': '#D5C6C6',
  			'pink-white': '#ECE5E0',
        'pink-black': '#412E43',
        'pink-vivid':'#E8A6B4',
        'base-black': '#030303',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
} satisfies Config;
