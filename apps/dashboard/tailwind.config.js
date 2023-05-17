const svgToDataUri = require("mini-svg-data-uri");
const plugin = require("tailwindcss/plugin");

module.exports = {
 darkMode: "class",
 content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./config.js"],
 theme: {
  extend: {
   colors: {
    "background-primary": "#121826",
    "background-secondary": "#1c283d",
    "background-navbar": "#141f2f",
    "background-menu": "#162235",
    "accent-primary": "#007CF0",
    "button-primary": "#007CF0",
    "button-primary-hover": "#2594fc",
    "button-secondary": "#1c283d",
    "button-secondary-hover": "#1f2d44",
    "button-action-primary": "#ea4d4d",
    "button-action-hover": "#ff5f5f",
   },
   backgroundImage: {
    shapes: "url('/assets/svg/background.svg')",
   },
   fontSize: {
    normal: ["1.1rem", "1.45rem"],
   },
   keyframes: {
    shimmer: {
     "100%": {
      transform: "translateX(100%)",
     },
    },
    loader: {
     "0%": {
      height: "0.5rem",
      opacity: 0.2,
     },
     "50%": {
      height: "1rem",
      opacity: 1,
     },
     "100%": {
      height: "0.5rem",
      opacity: 0.2,
     },
    },
   },
  },
 },
 plugins: [
  plugin(({ matchUtilities }) => {
   matchUtilities({
    "bg-grid": (value) => ({
     backgroundImage: `url("${svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`)}")`,
    }),
   });
  }),
  /* eslint-disable global-require */
  require("tailwindcss-text-fill"),
  require("tailwind-gradient-mask-image"),
  require("@headlessui/tailwindcss"),
  require("@igorkowalczyk/is-browser"),
  /* eslint-enable global-require */
 ],
};
