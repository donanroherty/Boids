import createTick from "./tick.js"
function createBoidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis
  const tick = createTick(update)

  function update(deltatime) {}

  return {
    canvas,
    tick,
  }
}

export default createBoidsApp
