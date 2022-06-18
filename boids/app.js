import createTick from "./tick.js"
import createFlock from "./flock.js"

function createBoidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis
  const flock = createFlock(canvas)
  const tick = createTick(update)

  function update(deltatime) {
    flock.update(deltatime)
  }

  return {
    canvas,
    flock,
    tick,
  }
}

export default createBoidsApp
