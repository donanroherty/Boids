function RangeSlider(props = defaultProps) {
  const split = String(props.step).split(".")
  const decimals = split.length > 1 ? split[1].length : 0

  return (
    <div class="flex flex-row py-1 text-xs w-full h-7">
      <label class="w-64 my-auto">{props.label}</label>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onInput={(e) => props.setValue(e.target.value)}
        class="w-full h-full my-auto ml-auto bg-gray-200  appearance-none slider-thumb rounded-sm border-[1px] border-gray-300 border-solid"
      ></input>
      <div class="w-16 h-full ml-2 text-right">{parseFloat(props.value).toFixed(decimals)}</div>
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
