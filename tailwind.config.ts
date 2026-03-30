import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        navy: {
          deep: '#0A1A3A',
          card: '#161C2D'
        },
        gold: {
          pure: '#FFD700',
          metallic: '#D4AF37',
          burnished: '#B87333',
          badge: '#F5A623',
          light: '#FFF0B3'
        }
      },
      backgroundImage: {
        'coppr-gradient': 'linear-gradient(45deg, #FFD700 0%, #D4AF37 50%, #B87333 100%)',
        'coppr-radial': 'radial-gradient(circle at center, #112854 0%, #0A1A3A 100%)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '24px',
        'badge': '6px',
      }
    },
  },
  plugins: [],
};
export default config;
