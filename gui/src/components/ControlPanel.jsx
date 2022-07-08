import { createSignal, createEffect } from "solid-js"
import FlockControls from "./FlockControls"
import TabBar from "./TabBar"
import { randColor } from "../utils"

function ControlPanel(props) {
  const [flocks, setFlocks] = createSignal(props.boidsApp.flockHandler.getAllFlockIDs())
  const [selectedFlockID, setSelectedFlockID] = createSignal(flocks()[0])
  const [config, setConfig] = createSignal(
    props.boidsApp.flockHandler.getFlockConfig(selectedFlockID())
  )

  const [useQuadTree, setUseQuadTree] = createSignal(props.boidsApp.useQuadTree)
  const [renderQuadTree, setRenderQuadTree] = createSignal(props.boidsApp.bRenderQuadTree)
  const [tabData, setTabData] = createSignal(
    props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c.color }))
  )
  const [isPaused, setIsPaused] = createSignal(props.boidsApp.isPaused)

  createEffect((prev) => {
    if (prev === selectedFlockID()) {
      setFlockConfig(selectedFlockID(), config())
    }
    return selectedFlockID()
  })

  function selectFlock(id) {
    setSelectedFlockID(id)
    if (selectedFlockID() !== null) setConfig(props.boidsApp.flockHandler.getFlockConfig(id))
  }

  function updateConfig(cfg) {
    props.boidsApp.flockHandler.setFlockConfig(selectedFlockID(), cfg)
    setConfig(props.boidsApp.flockHandler.getFlockConfig(selectedFlockID()))
  }

  function resetConfig() {
    selectedFlockID().setConfig(selectedFlockID().defaultConfig)
    setConfig(props.boidsApp.getFlockConfig(selectedFlockID()))
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

    const usedColors = flocks().reduce(
      (acc, fid) => acc.concat(props.boidsApp.flockHandler.getFlockConfig(fid).color),
      []
    )

    props.boidsApp.flockHandler.addFlock({ color: randColor(usedColors) })
    setFlocks(props.boidsApp.flockHandler.getAllFlockIDs())
    selectFlock(flocks()[flocks().length - 1])
    setTabData(props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c.color })))
  }

  function removeFlock(flockID) {
    const outIdx = flocks().findIndex((f) => f === flockID)
    const currIdx = flocks().findIndex((f) => f === selectedFlockID())
    const nextSelectIdx =
      outIdx > currIdx
        ? currIdx
        : outIdx < currIdx
        ? currIdx - 1
        : outIdx > 0
        ? outIdx - 1
        : outIdx + 1 < flocks().length
        ? outIdx + 1
        : null

    props.boidsApp.flockHandler.removeFlock(flockID)
    setFlocks(props.boidsApp.flockHandler.getAllFlockIDs())
    setTabData(props.boidsApp.flockHandler.getAllFlockConfigs().map((c) => ({ color: c.color })))
    selectFlock(nextSelectIdx !== null ? flocks()[nextSelectIdx] : null)
  }

  return (
    <div>
      <TabBar
        tabData={tabData()}
        selectTab={(tabIdx) => selectFlock(flocks()[tabIdx])}
        selectedTab={flocks().findIndex((f) => f === selectedFlockID())}
        addTab={() => flocks.length < props.maxFlocks && addFlock()}
        closeTab={(tabIdx) => removeFlock(flocks()[tabIdx])}
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
