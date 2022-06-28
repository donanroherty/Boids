import { createSignal } from "solid-js"

function RangeSlider(props = defaultProps) {
  const split = String(props.step).split(".")
  const decimals = split.length > 1 ? split[1].length : 0

  function onInput(e) {
    props.setValue(parseFloat(e.target.value))
  }

  function onDecrement() {
    props.setValue(props.value - props.step)
  }
  function onIncrement() {
    props.setValue(props.value + props.step)
  }

  return (
    <div
      class={`flex h-4 w-full select-none items-center py-0.5 text-xs ${
        props.disabled && "text-gray-400"
      }`}
    >
      <label class="w-64">{props.label}</label>

      <div class="flex h-full w-full">
        {/* Decrement */}
        <div
          class="w-4 rounded-l-sm border-[1px] border-r-0 border-transparent px-1 text-center hover:border-gray-300 hover:bg-gray-200"
          onClick={onDecrement}
        >
          <div class="relative -top-[.1rem]">-</div>
        </div>

        {/* Slider */}
        <input
          disabled={props.disabled}
          type="range"
          min={props.min}
          max={props.max}
          value={props.disabled ? 0 : props.value}
          step={props.step}
          onInput={onInput}
          class={`${
            props.disabled ? "slider-thumb-disabled" : "slider-thumb"
          } my-auto ml-auto h-full w-full  appearance-none rounded-sm border-[1px] border-solid border-gray-300 bg-gray-200`}
        ></input>
        {/* Increment */}
        <div
          class="flex w-4 justify-center rounded-r-sm border-[1px] border-l-0 border-transparent px-1 pl-1 text-center align-middle hover:border-gray-300 hover:bg-gray-200 "
          onClick={onIncrement}
        >
          <div class="relative -top-[.1rem]">+</div>
        </div>
      </div>

      <div class="ml-2 h-full w-16 text-right">
        {props.disabled ? "0" : parseFloat(props.value).toFixed(decimals)}
      </div>
    </div>
  )
}

const defaultProps = {
  label: "",
  min: 0,
  max: 1,
  step: 0.001,
  value: 0,
  setValue: (val) => {},
}

export default RangeSlider
