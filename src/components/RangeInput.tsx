import React, { useCallback, useRef } from "react"
import "./range-input.css"

type RangeInputProps = {
  min: number
  max: number
  step: number
  value: number
  setValue: (val: number) => void
}

function RangeInput(props: RangeInputProps) {
  const inputRef = useRef<HTMLInputElement>()
  const rangeCB = useCallback((el: HTMLInputElement) => {
    inputRef.current = el
    updateBackgroundGradient()
  }, [])

  function updateBackgroundGradient() {
    const input = inputRef.current
    if (!input) return

    const min = parseFloat(input.min)
    const max = parseFloat(input.max)
    const val = parseFloat(input.value)
    input.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%"
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.setValue(parseFloat(e.target.value))
    updateBackgroundGradient()
  }

  return (
    <input
      ref={rangeCB}
      type="range"
      title="slider"
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value}
      onChange={handleChange}
      className="range w-full"
    />
  )
}

export default RangeInput
