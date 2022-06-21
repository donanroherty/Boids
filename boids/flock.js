import createBoid from "./boid.js"
import vec2 from "./vec2.js"

function createFlock(canvas) {
  let numBoids = 100

  let boids = Array(numBoids)
    .fill(undefined)
    .map((_) => createRandomBoid())

  function createRandomBoid() {
    const sceneSize = vec2(canvas.width, canvas.height)
    const pos = sceneSize.mul(vec2(Math.random(), Math.random()))
    const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
      .norm()
      .scale(100)
    return createBoid(pos, vel, canvas)
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

  function updateFlockSize() {
    if (boids.length > numBoids) {
      return boids.slice(0, boids.length - (boids.length - numBoids) - 1)
    } else if (boids.length < numBoids) {
      return boids.concat(
        Array(numBoids - boids.length)
          .fill(undefined)
          .map((_) => createRandomBoid())
      )
    }
    return boids
  }

  function setNumBoids(num) {
    numBoids = num
    boids = updateFlockSize()
  }

  function setFlockConfig(cfg) {
    boids.forEach((b) => b.setConfig(cfg))
  }

  function getBoids() {
    return boids
  }

  return {
    update,
    getBoids,
    draw,
    setNumBoids,
    setFlockConfig,
  }
}

export default createFlock
