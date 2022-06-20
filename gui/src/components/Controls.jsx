import { createEffect, createSignal } from "solid-js"
import RangeSlider from "./RangeSlider"

let numBoidsDefault = 100
let cfg = {
  size: 5,
  detectionRange: 50,
  cohesionFactor: 0.2,
  alignmentMaxStrength: 0.3,
  separationMaxStrength: 10,
  separationRange: 30,
  dragFactor: 0.01,
  minSpeed: 50,
  maxSpeed: 150,
}

function Controls(props = defaultProps) {
  const [numBoids, setNumBoids] = createSignal(numBoidsDefault)
  const [size, setSize] = createSignal(cfg.size)
  const [detectionRange, setDetectionRange] = createSignal(cfg.detectionRange)
  const [cohesionFactor, setCohesionFactor] = createSignal(cfg.cohesionFactor)
  const [alignmentMaxStrength, setAlignmentMaxStrength] = createSignal(cfg.alignmentMaxStrength)
  const [separationMaxStrength, setSeparationMaxStrength] = createSignal(cfg.separationMaxStrength)
  const [separationRange, setSeparationRange] = createSignal(cfg.separationRange)
  const [dragFactor, seetDragFactor] = createSignal(cfg.dragFactor)
  const [minSpeed, setMinSpeed] = createSignal(cfg.minSpeed)
  const [maxSpeed, setMaxSpeed] = createSignal(cfg.maxSpeed)

  createEffect(() => {
    let config = {
      size: size(),
      detectionRange: detectionRange(),
      cohesionFactor: cohesionFactor(),
      alignmentMaxStrength: alignmentMaxStrength(),
      separationMaxStrength: separationMaxStrength(),
      separationRange: separationRange(),
      dragFactor: dragFactor(),
      minSpeed: minSpeed(),
      maxSpeed: maxSpeed(),
    }

    if (!props.boidsApp) return
    props.boidsApp.flock.setFlockConfig(config)
    props.boidsApp.flock.setNumBoids(numBoids())
  })

  function reset() {
    setNumBoids(numBoidsDefault)
    setSize(cfg.size)
    setDetectionRange(cfg.detectionRange)
    setCohesionFactor(cfg.cohesionFactor)
    setAlignmentMaxStrength(cfg.alignmentMaxStrength)
    setSeparationMaxStrength(cfg.separationMaxStrength)
    setSeparationRange(cfg.separationRange)
    seetDragFactor(cfg.dragFactor)
    setMinSpeed(cfg.minSpeed)
    setMaxSpeed(cfg.maxSpeed)
  }

  return (
    <div>
      <RangeSlider
        label="Num Boids"
        min={0}
        max={500}
        step={1}
        value={numBoids()}
        setValue={setNumBoids}
      />
      <RangeSlider
        label="Detection Range"
        min={0}
        max={300}
        step={0.001}
        value={detectionRange()}
        setValue={setDetectionRange}
      />
      <RangeSlider
        label="Cohesion Factor"
        min={0}
        max={0.5}
        step={0.001}
        value={cohesionFactor()}
        setValue={setCohesionFactor}
      />
      <RangeSlider
        label="Alignment Force"
        min={0}
        max={2}
        step={0.001}
        value={alignmentMaxStrength()}
        setValue={setAlignmentMaxStrength}
      />
      <RangeSlider
        label="Separation Force"
        min={0}
        max={20}
        step={0.001}
        value={separationMaxStrength()}
        setValue={setSeparationMaxStrength}
      />
      <RangeSlider
        label="Separation Range"
        min={0}
        max={50}
        step={0.001}
        value={separationRange()}
        setValue={setSeparationRange}
      />

      <RangeSlider
        label="Drag"
        min={0}
        max={0.5}
        step={0.001}
        value={dragFactor()}
        setValue={seetDragFactor}
      />
      <RangeSlider
        label="Min Speed"
        min={0}
        max={500}
        step={0.001}
        value={minSpeed()}
        setValue={setMinSpeed}
      />
      <RangeSlider
        label="Max Speed"
        min={0}
        max={500}
        step={0.001}
        value={maxSpeed()}
        setValue={setMaxSpeed}
      />
      <RangeSlider
        label="Size"
        id="size"
        min={0}
        max={15}
        step={0.001}
        value={size()}
        setValue={setSize}
      />
      <button
        onClick={reset}
        class="bg-gray-400 hover:bg-gray-300 text-white font-bold rounded-md border-[1px] border-gray-500 border-solid w-full px-4 h-full mt-1"
      >
        Reset
      </button>
    </div>
  )
}

const defaultProps = {
  boidsApp: undefined,
}

export default Controls
