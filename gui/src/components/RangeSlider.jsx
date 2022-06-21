function RangeSlider(props = defaultProps) {
  function onInput(e) {
    props.setValue(e.target.value)
  }

  return (
    <div class="flex flex-row py-1 text-xs w-full h-7">
      <label class="w-64 my-auto">{props.label}</label>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onInput={onInput}
        class="w-full h-full my-auto ml-auto bg-gray-200  appearance-none slider-thumb rounded-sm border-[1px] border-gray-300 border-solid"
      ></input>
      <div class="w-16 h-full ml-2 text-right">{parseFloat(props.value).toFixed(2)}</div>
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
