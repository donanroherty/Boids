import Checkbox from "./Checkbox"
import RangeSlider from "./RangeSlider"

function Controls(props) {
  function setConfigProperty(key, value) {
    props.setConfig({ ...props.config, [key]: value })
  }

  return (
    <div class="flex flex-col rounded-bl-md rounded-br-md border-l-[1px] border-b-[1px] border-r-[1px] border-solid border-black border-t-inherit bg-gray-100 px-2 py-2">
      <div class="text-xs font-bold">Interactions with other flocks:</div>
      <div class="mt-1 flex gap-4 pb-2">
        <Checkbox
          label={"Cohesion"}
          value={props.config.coheseWithOtherFlocks}
          setValue={(val) => setConfigProperty("coheseWithOtherFlocks", val)}
        />
        <Checkbox
          label={"Alignment"}
          value={props.config.alignWithOtherFlocks}
          setValue={(val) => setConfigProperty("alignWithOtherFlocks", val)}
        />
        <Checkbox
          label={"Separation"}
          value={props.config.separateFromOtherFlocks}
          setValue={(val) => setConfigProperty("separateFromOtherFlocks", val)}
        />
      </div>

      <div class="mt-1 text-xs font-bold">Flock controls:</div>
      <div class="gap-y-2px mt-1 grid gap-x-1 sm:grid-cols-2">
        <div class="flex flex-col sm:pr-2">
          <RangeSlider
            label="Num Boids"
            min={0}
            max={500}
            step={1}
            value={props.config.numBoids}
            setValue={(val) => setConfigProperty("numBoids", val)}
            disabled={props.disabled}
          />
          <RangeSlider
            label="Detection Range"
            min={0}
            max={300}
            step={0.1}
            value={props.config.detectionRange}
            setValue={(val) => setConfigProperty("detectionRange", val)}
            disabled={props.disabled}
          />
          <RangeSlider
            label="Cohesion Factor"
            min={0}
            max={0.5}
            step={0.01}
            value={props.config.cohesionFactor}
            setValue={(val) => setConfigProperty("cohesionFactor", val)}
            disabled={props.disabled}
          />
          <RangeSlider
            label="Alignment Force"
            min={0}
            max={2}
            step={0.01}
            value={props.config.alignmentMaxStrength}
            setValue={(val) => setConfigProperty("alignmentMaxStrength", val)}
            disabled={props.disabled}
          />
          <RangeSlider
            label="Separation Force"
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
        <div class="flex flex-col sm:pl-2">
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
            id="size"
            min={0}
            max={15}
            step={0.1}
            value={props.config.size}
            setValue={(val) => setConfigProperty("size", val)}
            disabled={props.disabled}
          />
          <div class="h-full w-full pt-2 pb-1">
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
  )
}

export default Controls
