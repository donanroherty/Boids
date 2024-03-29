import { BoidConfig, createBoid, createConfig } from "./boid"
import vec2, { Vec2 } from "./lib/vec2"
import { Scene } from "./scene"

export type FlockHandler = ReturnType<typeof createFlockHandler>

function createFlockHandler(scene: Scene) {
  let lastFlockID = -1

  function addFlock(cfg?: Partial<BoidConfig>, spawnPos?: Vec2) {
    const flock = ++lastFlockID
    const config = createConfig(cfg)

    const newBoids = Array.from(Array(config.numBoids), (_, index) => {
      const pos = spawnPos || scene.getSceneSize().mul(vec2(Math.random(), Math.random()))
      const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
        .norm()
        .scale(config.minSpeed)

      return createBoid(pos, vel, flock, index, config, scene)
    })

    newBoids.forEach((b) => scene.entities.add(b))
  }

  function removeFlock(flockID: number) {
    scene.entities.forEach((e) => {
      if (e.flock === flockID) scene.entities.delete(e)
    })
  }

  function onChangeNumBoids(flockID: number, cfg: BoidConfig) {
    const boidEntities = getFlockEntities(flockID)
    const len = boidEntities.length

    if (len > cfg.numBoids) {
      boidEntities.forEach((b, i) => i >= cfg.numBoids && scene.entities.delete(b))
    } else if (len < cfg.numBoids) {
      const diff = cfg.numBoids - len
      for (let i = 0; i < diff; i++) {
        const pos = scene.getSceneSize().mul(vec2(Math.random(), Math.random()))
        const vel = vec2(-Math.random() + Math.random(), -Math.random() + Math.random())
          .norm()
          .scale(cfg.minSpeed)

        scene.entities.add(createBoid(pos, vel, flockID, len + i, cfg, scene))
      }
    }
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

  function getAllFlockIDs() {
    return Array.from(new Set(Array.from(scene.entities).map((e) => e.flock)))
  }

  function getFlockEntities(flockID: number) {
    return Array.from(scene.entities).filter((e) => e.flock === flockID, [])
  }

  function getFlockConfig(flockID: number): BoidConfig | undefined {
    const member = Array.from(scene.entities).find((e) => e.flock === flockID)
    return member ? member.config : undefined
  }

  function getFlockInitialConfig(flockID: number): BoidConfig | undefined {
    const member = Array.from(scene.entities).find((e) => e.flock === flockID)
    return member ? member.defaultConfig : undefined
  }

  function getAllFlockConfigs(): BoidConfig[] {
    return getAllFlockIDs().map((fid) => getFlockConfig(fid) as BoidConfig)
  }

  return {
    addFlock,
    removeFlock,
    getAllFlockIDs,
    getFlockConfig,
    getFlockInitialConfig,
    getAllFlockConfigs,
    setFlockConfig,
  }
}

export { createFlockHandler }
