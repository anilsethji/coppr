import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", 'system-ui', 'sans-serif'],
        display: ["var(--font-heading)", 'system-ui', 'sans-serif'],
        mono: ["var(--font-mono)", 'monospace'],
      },
      colors: {
        background: '#020617',
        card: '#050810',
        navy: {
          deep: '#0F172A',
          card: '#1E293B'
        },
        gold: {
          pure: '#FFD700',
          metallic: '#D4AF37',
          burnished: '#B87333',
          badge: '#F5A623',
          light: '#FFF0B3'
        },
        brand: {
          green: '#00E676',
          purple: '#9C6EFA',
          orange: '#FF6B35',
          red: '#FF4757',
          pine: '#00B0FF',
          hot: '#F5A623'
        }
      },
      backgroundImage: {
        'coppr-gradient': 'linear-gradient(45deg, #FFD700 0%, #D4AF37 50%, #B87333 100%)',
        'coppr-radial': 'radial-gradient(circle at center, #112854 0%, #0A1A3A 100%)',
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'badge': '4px',
      }
    },
  },
  plugins: [],
};
export default config;
