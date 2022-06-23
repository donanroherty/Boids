import createTick from "./tick.js"
import flock from "./flock.js"
import vec2 from "./vec2.js"

function boidsApp(canvas) {
  canvas.style.transform = "scaleY(-1)" // flip y axis

  let flocks = []
  const tick = createTick(update)
  tick.start()

  function update(deltatime) {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    flocks.forEach((flock) => {
      flock.update(deltatime)
      flock.draw(canvas)
    })
  }

  function addFlock(app, cfg) {
    const f = flock(app, cfg)
    flocks = [...flocks, f]
    return f
  }

  function removeFlock(flock) {
    flocks = flocks.filter((f) => f !== flock)
  }

  function getFlocks() {
    return flocks
  }

  function getSceneSize() {
    return vec2(canvas.width, canvas.height)
  }

  return {
    canvas,
    getFlocks,
    addFlock,
    removeFlock,
    tick,
    getSceneSize,
  }
}

export default boidsApp
