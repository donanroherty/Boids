import { useEffect, useState } from "react"
import { BoidsApp } from "../boids/src/app"

function useAppConfig(boidsApp: BoidsApp) {
  const [boidSearchOptimization, setBoidSearchOptimization] = useState(
    boidsApp.getBoidSearchOptimization()
  )
  const [drawBoidSearchOptimization, setDrawBoidSearchOptimization] = useState(
    boidsApp.getDrawBoidSearchOptimization()
  )
  const [colliderSearchOptimization, setColliderOptimization] = useState(
    boidsApp.getColliderSearchOptimization()
  )
  const [drawColliderSearchOptimization, setDrawColliderOptimization] = useState(
    boidsApp.getDrawColliderSearchOptimization()
  )

  useEffect(() => {
    boidsApp.setBoidSearchOptimization(boidSearchOptimization)
    boidsApp.setDrawBoidSearchOptimization(drawBoidSearchOptimization)
    boidsApp.setColliderSearchOptimization(colliderSearchOptimization)
    boidsApp.setDrawColliderSearchOptimization(drawColliderSearchOptimization)
  }, [
    boidSearchOptimization,
    drawBoidSearchOptimization,
    colliderSearchOptimization,
    drawColliderSearchOptimization,
  ])

  return {
    boidSearchOptimization,
    setBoidSearchOptimization,
    drawBoidSearchOptimization,
    setDrawBoidSearchOptimization,
    colliderSearchOptimization,
    setColliderOptimization,
    drawColliderSearchOptimization,
    setDrawColliderOptimization,
  }
}

export default useAppConfig
