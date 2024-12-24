/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
    theme: {
      extend: {
        colors: {
          primary: '#27374D',  // Deep Blue
          secondary: '#526D82',  // Warm Light Blue
          accent: '#9DB2BF',  // Light Grayish Blue
          background: '#DDE6ED',  // Very Light Grayish Blue
        },
      },
    },
    plugins: [],
  }