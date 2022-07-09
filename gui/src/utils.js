function randColor(exclude = []) {
  if (exclude.length === colors.length) return "black"

  let color

  do {
    color = colors[Math.floor(colors.length * Math.random())]
  } while (exclude.length > 0 && exclude.find((c) => c === color) !== undefined)

  return color
}

const colors = [
  "black",
  "gray",
  "maroon",
  "red",
  "purple",
  "fuchsia",
  "green",
  "olive",
  "navy",
  "blue",
  "teal",
  "blueviolet",
  "brown",
  "chocolate",
  "coral",
  "cornflowerblue",
  "crimson",
  "darkblue",
  "darkorange",
  "darkslategray",
]

export { randColor }
