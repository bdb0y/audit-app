/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    minHeight: {
      '1/2': '50%',
      '16': '1rem'
    },
    extend: {
      colors: {
        'satcom-a': '#55BAD7',
        'satcom-b': '#58D9EF',
        'self-subject': '#02edd9',
        'yellow-counter': '#d1b209'
      }
    },
  },
  plugins: [],
}
