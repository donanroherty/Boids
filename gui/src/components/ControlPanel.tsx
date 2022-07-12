import { createSignal, createEffect, onMount, onCleanup } from "solid-js"
import FlockControls from "./FlockControls"
import TabBar from "./TabBar"
import { randColor } from "../utils"
import { BoidsApp } from "../../../boids/src/app"
import { BoidConfig } from "../../../boids/src/boid"

function ControlPanel(props: { boidsApp: BoidsApp; maxFlocks: number }) {
  const [flocks, setFlocks] = createSignal(props.boidsApp.flockHandler.getAllFlockIDs())
  const [selectedFlockID, setSelectedFlockID] = createSignal(flocks()[0])
  const [config, setConfig] = createSignal<BoidConfig>(
    props.boidsApp.flockHandler.getFlockConfig(selectedFlockID())!
  )

  const [useQuadTree, setUseQuadTree] = createSignal(props.boidsApp.useQuadTree)
  const [renderQuadTree, setRenderQuadTree] = createSignal(props.boidsApp.bRenderQuadTree)
  const [tabData, setTabData] = createSignal(
    props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c!.color }))
  )
  const [isPaused, setIsPaused] = createSignal(props.boidsApp.isPaused)

  createEffect((prev) => {
    if (prev === selectedFlockID()) {
      props.boidsApp.flockHandler.setFlockConfig(selectedFlockID(), config() as BoidConfig)
    }
    return selectedFlockID()
  })

  onMount(() => {
    document.addEventListener("keypress", onKeyPress)

    onCleanup(() => {
      document.removeEventListener("keypress", onKeyPress)
    })

    function onKeyPress(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault()
        togglePause()
      }
    }
  })

  function selectFlock(id: number) {
    setSelectedFlockID(id)
    if (selectedFlockID() !== -1) setConfig(props.boidsApp.flockHandler.getFlockConfig(id)!)
  }

  function updateConfig(cfg: BoidConfig) {
    props.boidsApp.flockHandler.setFlockConfig(selectedFlockID(), cfg)
    setConfig(props.boidsApp.flockHandler.getFlockConfig(selectedFlockID())!)
  }

  function resetConfig() {
    const defaultCfg = props.boidsApp.flockHandler.getFlockDefaultConfig(selectedFlockID())
    if (!defaultCfg) return

    props.boidsApp.flockHandler.setFlockConfig(selectedFlockID(), defaultCfg)
    setConfig(defaultCfg)
  }

  function toggleUseQuadTree() {
    props.boidsApp.useQuadTree = !props.boidsApp.useQuadTree
    setUseQuadTree(props.boidsApp.useQuadTree)
  }

  function toggleRenderQuadTree() {
    props.boidsApp.bRenderQuadTree = !props.boidsApp.bRenderQuadTree
    setRenderQuadTree(props.boidsApp.bRenderQuadTree)
  }

  function togglePause() {
    props.boidsApp.isPaused = !props.boidsApp.isPaused
    setIsPaused(props.boidsApp.isPaused)
  }

  function addFlock() {
    if (flocks().length >= props.maxFlocks) return

    const usedColors = flocks().reduce((acc: string[], fid) => {
      const cfg = props.boidsApp.flockHandler.getFlockConfig(fid)
      if (cfg) acc.push(cfg.color)
      return acc
    }, [])

    props.boidsApp.flockHandler.addFlock({ color: randColor(usedColors) })
    setFlocks(props.boidsApp.flockHandler.getAllFlockIDs())
    selectFlock(flocks()[flocks().length - 1])
    setTabData(props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c!.color })))
  }

  function removeFlock(flockID: number) {
    const outIdx = flocks().findIndex((f) => f === flockID)
    const currIdx = flocks().findIndex((f) => f === selectedFlockID())
    const nextSelectIdx: number =
      outIdx > currIdx
        ? currIdx
        : outIdx < currIdx
        ? currIdx - 1
        : outIdx > 0
        ? outIdx - 1
        : outIdx + 1 < flocks().length
        ? outIdx + 1
        : -1

    props.boidsApp.flockHandler.removeFlock(flockID)
    setFlocks(props.boidsApp.flockHandler.getAllFlockIDs())
    setTabData(props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c!.color })))
    const nextSelection = nextSelectIdx !== -1 ? flocks()[nextSelectIdx] : -1
    selectFlock(nextSelection)
  }

  return (
    <div>
      <TabBar
        tabData={tabData()}
        selectTab={(tabIdx: number) => selectFlock(flocks()[tabIdx])}
        selectedTab={flocks().findIndex((f) => f === selectedFlockID())}
        addTab={() => flocks.length < props.maxFlocks && addFlock()}
        closeTab={(tabIdx: number) => removeFlock(flocks()[tabIdx])}
        maxTabs={props.maxFlocks}
      />

      <FlockControls
        config={config()}
        setConfig={updateConfig}
        resetConfig={resetConfig}
        togglePause={togglePause}
        isPaused={isPaused()}
        useQuadTree={useQuadTree()}
        renderQuadTree={renderQuadTree()}
        toggleUseQuadTree={toggleUseQuadTree}
        toggleRenderQuadTree={toggleRenderQuadTree}
        disabled={selectedFlockID() === null}
      />
    </div>
  )
}

export default ControlPanel
