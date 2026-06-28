export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.18)',
      },
      colors: {
        surface: '#0b1320',
        surface2: '#101a2a',
        accent: '#1fb6ff',
        accent2: '#22c55e',
        gold: '#d6b564',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.12), transparent 24%)',
      },
    },
  },
  plugins: [],
}
