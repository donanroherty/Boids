import vec2 from "./vec2.js"

function createBoid(pos, vel) {
  let position = pos
  let velocity = vel

  let config = {
    size: 5,
  }

  function update(dt, boids) {}

  function draw(canvas) {
    const ctx = canvas.getContext("2d")

    const hei = config.size
    const wid = config.size * 0.7

    const p0 = vec2(-wid * 0.5, -hei * 0.5)
    const p1 = vec2(0, hei * 0.5)
    const p2 = vec2(wid * 0.5, -hei * 0.5)

    ctx.save()

    const direction = velocity.norm()

    ctx.translate(position.x, position.y)
    ctx.rotate(Math.atan2(direction.y, direction.x) - Math.PI / 2)
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.closePath()
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.restore()
  }

  function getPosition() {
    return position
  }

  function getVelocity() {
    return velocity
  }

  return {
    update,
    draw,
    getPosition,
    getVelocity,
  }
}

export default createBoid
