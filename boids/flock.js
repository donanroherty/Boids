import createBoid from "./boid.js"
import vec2 from "./vec2.js"

function createFlock(canvas) {
  let numBoids = 100

  let boids = Array(numBoids)
    .fill(undefined)
    .map((_) => createRandomBoid())

  function createRandomBoid() {
    const sceneSize = vec2(canvas.clientWidth, canvas.clientHeight)
    const pos = sceneSize.mul(vec2(Math.random(), Math.random()))
    const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
      .norm()
      .scale(100)
    return createBoid(pos, vel)
  }

  function update(dt) {
    boids.forEach((boid) => boid.update(dt, boids))
  }

  function getBoids() {
    return boids
  }

  function draw(canvas) {
    boids.forEach((boid) => boid.draw(canvas))
  }

  return {
    update,
    getBoids,
    draw,
  }
}

export default createFlock
