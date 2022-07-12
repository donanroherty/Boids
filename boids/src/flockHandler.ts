import { Boid, BoidConfig, createBoid, createConfig } from "./boid"
import vec2, { Vec2 } from "./lib/vec2.js"

function createFlockHandler(entities: Set<Boid>, getSceneSize: () => Vec2) {
  let lastFlockID = -1

  function addFlock(cfg: Partial<BoidConfig>, spawnPos = undefined) {
    const flock = ++lastFlockID
    const config = createConfig(cfg)

    const newBoids = Array.from(Array(config.numBoids), (_, index) => {
      const pos = spawnPos || getSceneSize().mul(vec2(Math.random(), Math.random()))
      const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
        .norm()
        .scale(config.minSpeed)

      return createBoid(pos, vel, flock, index, config)
    })

    newBoids.forEach((b) => entities.add(b))
  }

  function onChangeNumBoids(flockID: number, cfg: BoidConfig) {
    const boidEntities = getFlockEntities(flockID)
    const len = boidEntities.length

    if (len > cfg.numBoids) {
      boidEntities.forEach((b, i) => i >= cfg.numBoids && entities.delete(b))
    } else if (len < cfg.numBoids) {
      const diff = cfg.numBoids - len
      for (let i = 0; i < diff; i++) {
        const pos = getSceneSize().mul(vec2(Math.random(), Math.random()))
        const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
          .norm()
          .scale(cfg.minSpeed)

        entities.add(createBoid(pos, vel, flockID, len + i, cfg))
      }
    }
  }

  function getAllFlockIDs() {
    return Array.from(new Set(Array.from(entities).map((e) => e.flock)))
  }

  function getFlockEntities(flockID: number) {
    return Array.from(entities).filter((e) => e.flock === flockID, [])
  }

  function getFlockConfig(flockID: number): BoidConfig | undefined {
    const member = Array.from(entities).find((e) => e.flock === flockID)
    return member ? member.config : undefined
  }

  function getFlockDefaultConfig(flockID: number): BoidConfig | undefined {
    const member = Array.from(entities).find((e) => e.flock === flockID)
    return member ? member.defaultConfig : undefined
  }

  function getAllFlockConfigs() {
    return getAllFlockIDs().map((fid) => getFlockConfig(fid))
  }

  function setFlockConfig(flockID: number, cfg: BoidConfig) {
    const prevCfg = getFlockConfig(flockID)
    const newCfg = { ...prevCfg, ...cfg }
    if (newCfg.numBoids === 0) newCfg.numBoids = 1

    getFlockEntities(flockID).forEach((e) => (e.config = newCfg))

    if (prevCfg && prevCfg.numBoids !== newCfg.numBoids) {
      onChangeNumBoids(flockID, newCfg)
    }
  }

  function removeFlock(flockID: number) {
    entities.forEach((e) => {
      if (e.flock === flockID) entities.delete(e)
    })
  }

  return {
    addFlock,
    removeFlock,
    getAllFlockIDs,
    getFlockConfig,
    getFlockDefaultConfig,
    getAllFlockConfigs,
    setFlockConfig,
  }
}

export { createFlockHandler }
