import boid from "./boid.js"
import vec2 from "./vec2.js"

function flock(app, initialConfig = {}) {
  let config = {
    color: "black",
    numBoids: 50,
    size: 5,
    detectionRange: 50,
    cohesionFactor: 0.2,
    alignmentMaxStrength: 0.3,
    separationMaxStrength: 10,
    separationRange: 30,
    dragFactor: 0.01,
    minSpeed: 50,
    maxSpeed: 150,
    ...initialConfig,
  }

  const defaultConfig = { ...config }

  let boids = []

  const self = {
    update,
    getBoids,
    draw,
    getConfig,
    getDefaultConfig,
    setConfig,
  }

  initialize()

  function initialize() {
    if (boids.length > config.numBoids) {
      boids = boids.slice(0, boids.length - (boids.length - config.numBoids))
    } else if (boids.length < config.numBoids) {
      boids = boids.concat(
        Array(config.numBoids - boids.length)
          .fill(undefined)
          .map((_) => createBoid())
      )
    }
  }

  function createBoid() {
    const sceneSize = app.getSceneSize()
    const pos = sceneSize.mul(vec2(Math.random(), Math.random()))
    const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
      .norm()
      .scale(config.minSpeed)
    return boid(pos, vel, self, app)
  }

  function update(dt) {
    boids.forEach((boid) => boid.update(dt))
  }

  function getBoids() {
    return boids
  }

  function draw(canvas) {
    boids.forEach((boid) => boid.draw(canvas))
  }

  function getConfig() {
    return config
  }

  function getDefaultConfig() {
    return defaultConfig
  }

  function setConfig(cfg) {
    config = { ...config, ...cfg }
    initialize()
    boids.forEach((b) => b.setConfig(cfg))
  }

  function getBoids() {
    return boids
  }

  return self
}

export default flock
