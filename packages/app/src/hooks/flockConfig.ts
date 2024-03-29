import { useState, useEffect, useRef } from "react"
import { BoidsApp } from "@boids/lib/src/app"
import { BoidConfig } from "@boids/lib/src/boid"

function useFlockConfig(boidsApp: BoidsApp, selectedFlock: number) {
  const cfg = boidsApp.getFlockhandler().getFlockConfig(selectedFlock) as BoidConfig
  const prevSelectedFlock = useRef(-1)

  const [color, setColor] = useState(cfg.color)
  const [numBoids, setNumBoids] = useState(cfg.numBoids)
  const [visionRange, setVisionRange] = useState(cfg.visionRange)
  const [fov, setFOV] = useState(cfg.fov)
  const [cohesion, setCohesion] = useState(cfg.cohesion)
  const [alignment, setAlignment] = useState(cfg.alignment)
  const [separation, setSeparation] = useState(cfg.separation)
  const [separationRange, setSeparationRange] = useState(cfg.separationRange)
  const [predatorAttack, setPredatorAttack] = useState(cfg.predatorAttack)
  const [predatorAvoid, setPredatorAvoid] = useState(cfg.predatorAvoid)
  const [drag, setDrag] = useState(cfg.drag)
  const [minSpeed, setMinSpeed] = useState(cfg.minSpeed)
  const [maxSpeed, setMaxSpeed] = useState(cfg.maxSpeed)
  const [obstacleAvoid, setObstacleAvoid] = useState(cfg.obstacleAvoid)
  const [size, setSize] = useState(cfg.size)
  const [isPredator, setIsPredator] = useState(cfg.isPredator)
  const [cohesionInteraction, setCohesionInteraction] = useState(cfg.cohesionInteraction)
  const [alignmentInteraction, setAlignmentInteraction] = useState(cfg.alignmentInteraction)
  const [separationInteraction, setSeparationInteraction] = useState(cfg.separationInteraction)
  const [drawDebug, setDrawDebug] = useState(cfg.drawDebug)

  function reset() {
    const initialCfg = boidsApp.getFlockhandler().getFlockInitialConfig(selectedFlock)
    if (initialCfg) setAll(initialCfg)
  }

  function setAll(cfg: BoidConfig) {
    setColor(cfg.color)
    setNumBoids(cfg.numBoids)
    setVisionRange(cfg.visionRange)
    setFOV(cfg.fov)
    setCohesion(cfg.cohesion)
    setAlignment(cfg.alignment)
    setSeparation(cfg.separation)
    setSeparationRange(cfg.separationRange)
    setPredatorAttack(cfg.predatorAttack)
    setPredatorAvoid(cfg.predatorAvoid)
    setDrag(cfg.drag)
    setMinSpeed(cfg.minSpeed)
    setMaxSpeed(cfg.maxSpeed)
    setObstacleAvoid(cfg.obstacleAvoid)
    setSize(cfg.size)
    setIsPredator(cfg.isPredator)
    setCohesionInteraction(cfg.cohesionInteraction)
    setAlignmentInteraction(cfg.alignmentInteraction)
    setSeparationInteraction(cfg.separationInteraction)
    setDrawDebug(cfg.drawDebug)
  }

  useEffect(() => {
    // handle flock selection changed
    {
      if (selectedFlock !== prevSelectedFlock.current) {
        const cfg = boidsApp.getFlockhandler().getFlockConfig(selectedFlock) as BoidConfig
        setAll(cfg)
        prevSelectedFlock.current = selectedFlock
        return
      }
    }

    // Handle flock config changed

    const newCfg: BoidConfig = {
      color,
      numBoids,
      size,
      fov,
      visionRange,
      cohesion,
      alignment,
      separation,
      separationRange,
      predatorAttack,
      predatorAvoid,
      drag,
      minSpeed,
      maxSpeed,
      obstacleAvoid,
      isPredator,
      cohesionInteraction,
      alignmentInteraction,
      separationInteraction,
      drawDebug,
    }

    boidsApp.getFlockhandler().setFlockConfig(selectedFlock, newCfg)
  }, [
    selectedFlock,
    color,
    numBoids,
    visionRange,
    fov,
    cohesion,
    alignment,
    separation,
    separationRange,
    predatorAttack,
    predatorAvoid,
    drag,
    minSpeed,
    maxSpeed,
    obstacleAvoid,
    size,
    isPredator,
    cohesionInteraction,
    alignmentInteraction,
    separationInteraction,
    drawDebug,
  ])

  return {
    color,
    setColor,
    numBoids,
    setNumBoids,
    visionRange,
    setVisionRange,
    fov,
    setFOV,
    cohesion,
    setCohesion,
    alignment,
    setAlignment,
    separation,
    setSeparation,
    separationRange,
    setSeparationRange,
    predatorAttack,
    setPredatorAttack,
    predatorAvoid,
    setPredatorAvoid,
    drag,
    setDrag,
    minSpeed,
    setMinSpeed,
    maxSpeed,
    setMaxSpeed,
    obstacleAvoid,
    setObstacleAvoid,
    size,
    setSize,
    isPredator,
    setIsPredator,
    cohesionInteraction,
    setCohesionInteraction,
    alignmentInteraction,
    setAlignmentInteraction,
    separationInteraction,
    setSeparationInteraction,
    drawDebug,
    setDrawDebug,
    reset,
  }
}

export default useFlockConfig
