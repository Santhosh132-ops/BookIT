// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // CRUCIAL: Scans all HTML, TSX, and JSX files in the src folder for Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}