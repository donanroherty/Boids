import { BoidConfig } from "../../../boids/src/boid"
import Checkbox from "./Checkbox"
import RangeSlider from "./RangeSlider"

function Controls(props: {
  config: BoidConfig
  disabled: boolean
  isPaused: boolean
  renderQuadTree: boolean
  useQuadTree: boolean
  resetConfig: () => void
  setConfig: (cfg: BoidConfig) => void
  togglePause: () => void
  toggleRenderQuadTree: () => void
  toggleUseQuadTree: () => void
}) {
  function setConfigProperty(key: string, value: String | number | boolean) {
    props.setConfig({ ...props.config, [key]: value })
  }

  return (
    <div class="flex w-full flex-col gap-3 rounded-bl-md rounded-br-md border-l-[1px] border-b-[1px] border-r-[1px] border-solid border-black border-t-inherit bg-gray-100 px-2 py-2">
      {/* System */}

      <div class="flex w-full justify-items-center gap-4 rounded-sm border-[1px] border-solid border-gray-300 bg-gray-200 p-1 align-middle">
        <div class="my-auto text-xs font-bold">System:</div>
        <div class="flex w-full gap-4">
          <Checkbox
            label={"Use Quadtree"}
            value={props.useQuadTree}
            setValue={props.toggleUseQuadTree}
          />
          <Checkbox
            label={"Render QT"}
            value={props.renderQuadTree}
            setValue={props.toggleRenderQuadTree}
            disabled={!props.useQuadTree}
          />
          <Checkbox
            label={"Draw Debug"}
            value={props.config.drawDebug}
            setValue={(val: boolean) => setConfigProperty("drawDebug", val)}
          />

          <button
            onClick={props.togglePause}
            class="ml-auto h-full w-32 rounded-md border-[1px] border-solid border-gray-500 bg-gray-400 font-bold text-white hover:bg-gray-300"
          >
            {props.isPaused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
      {/* Interactions */}
      <div class="flex gap-4">
        <div class="text-xs font-bold">Flock interactions:</div>
        <div class="flex gap-4">
          <Checkbox
            label={"Cohesion"}
            value={props.config.coheseWithOtherFlocks}
            setValue={(val: boolean) => setConfigProperty("coheseWithOtherFlocks", val)}
            disabled={props.config.isPredator}
          />
          <Checkbox
            label={"Alignment"}
            value={props.config.alignWithOtherFlocks}
            setValue={(val: boolean) => setConfigProperty("alignWithOtherFlocks", val)}
            disabled={props.config.isPredator}
          />
          <Checkbox
            label={"Separation"}
            value={props.config.separateFromOtherFlocks}
            setValue={(val: boolean) => setConfigProperty("separateFromOtherFlocks", val)}
            disabled={props.config.isPredator}
          />
          <Checkbox
            label={"Predator"}
            value={props.config.isPredator}
            setValue={(val: boolean) => setConfigProperty("isPredator", val)}
          />
        </div>
      </div>
      {/* Controls */}
      <div class="flex flex-col">
        <div class="text-xs font-bold">Flock controls:</div>
        <div class="gap-y-2px mt-1 grid gap-x-1 sm:grid-cols-2">
          <div class="flex flex-col gap-1 sm:pr-2">
            <RangeSlider
              label="Num Boids"
              min={0}
              max={300}
              step={1}
              value={props.config.numBoids}
              setValue={(val) => setConfigProperty("numBoids", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Detection Range"
              min={0}
              max={300}
              step={1}
              value={props.config.detectionRange}
              setValue={(val) => setConfigProperty("detectionRange", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Field Of View"
              min={0}
              max={360}
              step={1}
              value={props.config.fov}
              setValue={(val) => setConfigProperty("fov", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Cohesion"
              min={0}
              max={0.5}
              step={0.001}
              value={props.config.cohesionFactor}
              setValue={(val) => setConfigProperty("cohesionFactor", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Alignment"
              min={0}
              max={2}
              step={0.01}
              value={props.config.alignmentMaxStrength}
              setValue={(val) => setConfigProperty("alignmentMaxStrength", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Separation"
              min={0}
              max={20}
              step={0.1}
              value={props.config.separationMaxStrength}
              setValue={(val) => setConfigProperty("separationMaxStrength", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Separation Range"
              min={0}
              max={50}
              step={0.1}
              value={props.config.separationRange}
              setValue={(val) => setConfigProperty("separationRange", val)}
              disabled={props.disabled}
            />
          </div>
          <div class="flex flex-col gap-1 sm:pl-2">
            <RangeSlider
              label="Predator Attack"
              min={0}
              max={1.5}
              step={0.1}
              value={props.config.predatorAttack}
              setValue={(val) => setConfigProperty("predatorAttack", val)}
              disabled={props.disabled || !props.config.isPredator}
            />
            <RangeSlider
              label="Predator Avoid"
              min={0}
              max={150}
              step={0.1}
              value={props.config.predatorAvoid}
              setValue={(val) => setConfigProperty("predatorAvoid", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Drag"
              min={0}
              max={0.2}
              step={0.001}
              value={props.config.dragFactor}
              setValue={(val) => setConfigProperty("dragFactor", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Min Speed"
              min={0}
              max={500}
              step={0.1}
              value={props.config.minSpeed}
              setValue={(val) => setConfigProperty("minSpeed", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Max Speed"
              min={0}
              max={500}
              step={0.1}
              value={props.config.maxSpeed}
              setValue={(val) => setConfigProperty("maxSpeed", val)}
              disabled={props.disabled}
            />
            <RangeSlider
              label="Boid Size"
              min={0}
              max={15}
              step={0.1}
              value={props.config.size}
              setValue={(val) => setConfigProperty("size", val)}
              disabled={props.disabled}
            />
            <div class="h-full w-full ">
              <button
                onClick={props.resetConfig}
                class="h-full w-full rounded-md border-[1px] border-solid border-gray-500 bg-gray-400 font-bold text-white hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls
