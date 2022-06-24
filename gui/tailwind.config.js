module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    fontFamily: {
      sans: ["Open Sans"],
      serif: [],
      mono: [],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("prettier-plugin-tailwindcss")],
}
