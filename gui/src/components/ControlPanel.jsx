import { createSignal, createEffect } from "solid-js"
import FlockControls from "./FlockControls"
import TabBar from "./TabBar"
import { randColor } from "../utils"

function ControlPanel(props) {
  const [flocks, setFlocks] = createSignal(props.boidsApp.getFlocks())
  const [activeFlock, setActiveFlock] = createSignal(flocks()[0])
  const [config, setConfig] = createSignal(flocks()[0].getConfig())

  createEffect((prev) => {
    if (prev === activeFlock()) {
      activeFlock().setConfig(config())
    }
    return activeFlock()
  })

  function selectFlock(idx) {
    setActiveFlock(flocks()[idx])

    if (activeFlock()) setConfig(flocks()[idx].getConfig())
  }

  function updateConfig(val) {
    activeFlock().setConfig(val)
    setConfig(activeFlock().getConfig())
  }

  function resetConfig() {
    activeFlock().setConfig(activeFlock().getDefaultConfig())
    setConfig(activeFlock().getConfig())
  }

  function addFlock() {
    if (flocks().length >= props.maxFlocks) return

    const usedColors = flocks().reduce((acc, f) => acc.concat([f.getConfig().color]), [])
    props.boidsApp.addFlock({ color: randColor(usedColors) })
    setFlocks(props.boidsApp.getFlocks())
    selectFlock(flocks().length - 1)
  }

  function removeFlock(idx) {
    const nextSelectIdx = idx > 0 ? idx - 1 : idx + 1 < flocks().length ? idx + 1 : null
    selectFlock(nextSelectIdx)

    props.boidsApp.removeFlock(flocks()[idx])
    setFlocks(props.boidsApp.getFlocks())
  }

  return (
    <div>
      <TabBar
        flocks={flocks()}
        selectFlock={selectFlock}
        selectedFlock={activeFlock()}
        addFlock={addFlock}
        removeFlock={removeFlock}
        maxTabs={props.maxFlocks}
      />
      <FlockControls
        config={config()}
        setConfig={updateConfig}
        resetConfig={resetConfig}
        disabled={!activeFlock()}
      />
    </div>
  )
}

export default ControlPanel
