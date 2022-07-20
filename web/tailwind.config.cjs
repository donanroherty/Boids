/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  fontFamily: {
    sans: ["Open Sans"],
  },
  theme: {
    extend: {
      colors: {
        boids_document_bg: "#1E1E1E",
        boids_scene_bg: "#2C2C2C",
        boids_scene_stroke: "#656565",
        boids_white: "#FFFFFF",
        boids_btn: "#656565",
        boids_btn_hover: "#9A9A9A",
        boids_blue: "#79B6EF",
        boids_red: "#EF8079",
        boids_green: "#ADEF79",
        boids_yellow: "#EFC779",
      },
    },
  },
  // plugins: [require("prettier-plugin-tailwindcss")],
}
