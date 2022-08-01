function randColor(exclude: string[] = []) {
  if (exclude.length === colors.length) return "black"

  let color: string = ""

  do {
    color = colors[Math.floor(colors.length * Math.random())]
  } while (exclude.length > 0 && exclude.find((c) => c === color) !== undefined)

  return color
}

const colors = ["#79B6EF", "#EF8079", "#ADEF79", "#EFC779"]

export { randColor, colors }
