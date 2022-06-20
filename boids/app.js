import createTick from "./tick.js"
import createFlock from "./flock.js"

function createBoidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis
  const flock = createFlock(canvas)
  const tick = createTick(update)

  function update(deltatime) {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    flock.update(deltatime)
    flock.draw(canvas)
  }

  return {
    canvas,
    flock,
    tick,
  }
}

export default createBoidsApp
