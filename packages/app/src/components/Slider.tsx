import Button from "./Button"
import RangeInput from "./RangeInput"

type SliderProps = {
  min: number
  max: number
  step: number
  value: number
  setValue: (val: number) => void
  color?: string
  className?: string
}

function SliderComp(props: SliderProps) {
  const { min = 0, max = 100, step = 1, value, setValue, color, className = "" } = props
  const precision = String(step).split(".")[1]?.length || 1

  function increment() {
    props.setValue(Math.min(max, value + step))
  }

  function decrement() {
    props.setValue(Math.max(min, value - step))
  }

  function handleValueChange(val: number) {
    setValue(val)
  }

  return (
    <div className={`flex items-center w-40 h-full transition-all gap-1 select-none ${className}`}>
      <Button icon="subtract" onClick={decrement} className="w-4 h-4" />

      <RangeInput min={min} max={max} step={step} value={value} setValue={handleValueChange} />

      <Button icon="plus" onClick={increment} className="w-4 h-4" />

      <div className={`text-xs font-light text-neutral-30 ${step <= 0.01 ? "w-14" : "w-10"}`}>
        {parseFloat(value.toPrecision(precision))}
      </div>
    </div>
  )
}

export default SliderComp
