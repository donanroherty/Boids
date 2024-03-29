import { useState, useRef, useEffect } from "react"
import { randColor } from "../utils"
import Button from "./Button"
import TabBar from "./TabBar"
import Tooltip from "./Tooltip"
import Sidebar from "./Sidebar"
import FPSCounter from "./FPSCounter"
import { BoidConfig } from "@boids/lib/src/boid"
import { BoidsApp } from "@boids/lib/src/app"

type UIProps = {
  boidsApp: BoidsApp
}

function UI(props: UIProps) {
  const { boidsApp } = props
  const [selectedFlock, setSelectedFlock] = useState(0)
  const [tabData, setTabData] = useState(getUpdatedTabData())
  const [isPaused, setIsPaused] = useState(boidsApp.getPaused())

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onSelectFlock(0)
  }, [])

  function onAddFlock() {
    const usedColors = boidsApp
      .getFlockhandler()
      .getAllFlockConfigs()
      .map((cfg: BoidConfig) => cfg.color)

    const color = randColor(usedColors)

    boidsApp.getFlockhandler().addFlock({ color })
    setTabData(getUpdatedTabData())
  }

  function onRemoveFlock(idx: number) {
    const flocks = boidsApp.getFlockhandler().getAllFlockIDs()
    boidsApp.getFlockhandler().removeFlock(flocks[idx])
    setTabData(getUpdatedTabData())
  }

  function onSelectFlock(idx: number) {
    const flocks = boidsApp.getFlockhandler().getAllFlockIDs()
    setSelectedFlock(flocks[idx])

    const ui = ref.current
    if (ui) {
      const cfg = boidsApp.getFlockhandler().getFlockConfig(flocks[idx])
      if (cfg) ui.style.setProperty("--flock-color", cfg.color)
    }
  }

  function getUpdatedTabData() {
    return boidsApp
      .getFlockhandler()
      .getAllFlockIDs()
      .map((id) => {
        const cfg = boidsApp.getFlockhandler().getFlockConfig(id)
        return {
          color: cfg!.color,
        }
      })
  }

  function handleClickPlayPause() {
    boidsApp.setPaused(!boidsApp.getPaused())
    setIsPaused(boidsApp.getPaused())
  }

  return (
    <div
      ref={ref}
      className="absolute grid h-full w-full grid-cols-1 grid-rows-[minmax(auto,1fr)] text-xs"
    >
      <Sidebar boidsApp={boidsApp} selectedFlock={selectedFlock} />

      {/* Bottom bar */}
      <div className="flex p-5">
        <TabBar
          onAddTab={onAddFlock}
          onCloseTab={onRemoveFlock}
          onSelectTab={onSelectFlock}
          tabData={tabData}
          maxTabs={4}
        />

        {/* Play/Pause button */}
        <Button
          icon="pause"
          altIcon="play"
          className="w-8 h-8"
          useAltIcon={isPaused}
          onClick={handleClickPlayPause}
        />
      </div>

      <Tooltip />

      <FPSCounter tick={boidsApp.getTick()} />
    </div>
  )
}

export default UI
