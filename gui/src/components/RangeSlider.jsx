import { createSignal } from "solid-js"

function RangeSlider(props = defaultProps) {
  const split = String(props.step).split(".")
  const decimals = split.length > 1 ? split[1].length : 0

  function onInput(e) {
    props.setValue(parseFloat(e.target.value))
  }

  return (
    <div class={`flex h-5 w-full select-none py-0.5 text-xs ${props.disabled && "text-gray-400"}`}>
      <label class="my-auto w-64">{props.label}</label>
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

      <div class="ml-2 h-full w-16 text-right">
        {props.disabled ? "-" : parseFloat(props.value).toFixed(decimals)}
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
