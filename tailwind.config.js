/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [ "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0D1B2A',
        primary: '#1B263B',
        secondary: '#415A77',
        accent: '#778DA9',
        textPrimary: '#E0E1DD',
        textSecondary: '#BCC2C7',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
        mono: ['SpaceMono', 'monospace'],
      },
    },
  },
  plugins: [],
}