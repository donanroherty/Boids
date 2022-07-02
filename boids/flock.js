import { createBoid } from "./boid.js"
import { clamp } from "./utils.js"
import vec2 from "./vec2.js"

function createFlock(app, initialConfig = {}, id) {
  let config = {
    color: "black",
    numBoids: 50,
    size: 5,
    fov: 340,
    detectionRange: 50,
    cohesionFactor: 0.2,
    alignmentMaxStrength: 0.3,
    separationMaxStrength: 10,
    separationRange: 30,
    predatorAttack: 0.9,
    predatorAvoid: 40,
    dragFactor: 0.01,
    minSpeed: 50,
    maxSpeed: 150,
    coheseWithOtherFlocks: false,
    alignWithOtherFlocks: false,
    separateFromOtherFlocks: false,
    isPredator: false,
    drawDebug: true,
    ...initialConfig,
  }

  if (config.isPredator) {
    config.coheseWithOtherFlocks = false
    config.alignWithOtherFlocks = false
    config.separateFromOtherFlocks = false
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
          .map((_, i) => createNewBoid(boids.length + i))
      )
    }
  }

  function createNewBoid(idx) {
    const sceneSize = app.getSceneSize()
    const pos = sceneSize.mul(vec2(Math.random(), Math.random()))
    const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
      .norm()
      .scale(config.minSpeed)

    return createBoid(pos, vel, id, idx, config)
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
    config.fov = clamp(config.fov, 1, 360)
    initialize()
    boids.forEach((b) => b.setConfig(cfg))
  }

  function getBoids() {
    return boids
  }

  return self
}

export default createFlock
