import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import { terser } from "rollup-plugin-terser"
import babel from "rollup-plugin-babel"
import postcss from "rollup-plugin-postcss"
import autoprefixer from "autoprefixer"
import tailwindcss from "tailwindcss"
import path from "path"
import fs from "fs"

const extensions = [".js", ".jsx"]
const version = JSON.parse(fs.readFileSync(`../package.json`, "utf8")).version

export default {
  input: "./src/boids-element.jsx",
  output: {
    file: `dist/boids-element_${version}.mjs`,
    format: "es",
  },
  external: [],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    resolve({ extensions }),
    babel({
      exclude: "node_modules/**",
      presets: ["solid"],
      extensions,
    }),
    postcss({
      plugins: [
        autoprefixer(),
        tailwindcss({
          content: ["./src/**/*.jsx"],
          config: "tailwind.config.js",
        }),
      ],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: false,
      inject: true,
    }),
    terser({ output: { comments: false } }),
  ],
}
