// frontend/postcss.config.cjs (Using CommonJS for reliability)

module.exports = {
  plugins: [
    // This format explicitly calls the required packages
    require('tailwindcss'), 
    require('autoprefixer'),
  ],
};