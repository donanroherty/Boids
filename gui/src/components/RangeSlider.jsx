function RangeSlider(props = defaultProps) {
  function onInput(e) {
    props.setValue(e.target.value)
  }

  return (
    <div class="flex flex-row py-1 text-xs">
      <label class="">{props.label}</label>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onInput={onInput}
        class="ml-auto mt-[.45rem] h-1 bg-gray-200  appearance-none slider-thumb rounded-sm border-[1px] border-gray-300 border-solid"
      ></input>
      <div class="w-10 ml-2 text-right">{props.value}</div>
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
