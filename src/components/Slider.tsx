import React from "react"
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

  return (
    <div className={`flex items-center w-40 h-full transition-all gap-1 select-none ${className}`}>
      <Button
        icon="subtract"
        onClick={() => props.setValue(Math.min(max, value + step))}
        className="w-4 h-4"
      />

      <RangeInput min={min} max={max} step={step} value={value} setValue={setValue} />

      <Button
        icon="plus"
        onClick={() => props.setValue(Math.min(max, value + step))}
        className="w-4 h-4"
      />

      <div className={`text-xs font-light text-neutral-30 ${step <= 0.01 ? "w-14" : "w-10"}`}>
        {value}
      </div>
    </div>
  )
}

export default SliderComp
