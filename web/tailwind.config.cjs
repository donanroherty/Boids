/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        boids_blue: "#79B6EF",
        boids_red: "#EF8079",
        boids_green: "#ADEF79",
        boids_yellow: "#EFC779",
      },
    },
  },
  plugins: [],
}
