function RangeSlider(props = defaultProps) {
  function onInput(e) {
    props.setValue(e.target.value)
  }

  return (
    <div>
      <label>{props.label}</label>
      <input
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onInput={onInput}
      ></input>
      <div>{props.value}</div>
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
