import { useRef, useCallback, useState } from "react"
import Button from "./Button"
import "./slider.css"

type SliderProps = {
  label?: string
  min?: number
  max?: number
  step?: number
  value?: number
  setValue?: (val: number) => void
  className?: string
}

function Slider(props: SliderProps) {
  const {
    label = "slider",
    min = 0,
    max = 100,
    step = 1,
    value = 35,
    setValue = (val: number) => {},
    className = "",
  } = props

  const [val, setVal] = useState(value)

  const rangeRef = useRef<HTMLInputElement>()
  const rangeCB = useCallback((el: HTMLInputElement) => {
    rangeRef.current = el
    updateBackgroundGradient()
  }, [])

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    updateBackgroundGradient()
    setVal(parseFloat(e.currentTarget.value))
    e.preventDefault()
  }

  function handleIncrement() {
    setVal(Math.min(max, val + step))
  }

  function handleDecrement() {
    setVal(Math.max(min, val - step))
  }

  function updateBackgroundGradient() {
    const el = rangeRef.current
    if (!el) return

    const min = parseFloat(el.min)
    const max = parseFloat(el.max)
    const val = parseFloat(el.value)
    el.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%"
  }

  updateBackgroundGradient()

  return (
    <div className={`flex items-center w-40 h-full gap-1 select-none ${className}`}>
      <Button icon="subtract" onClick={handleDecrement} className="w-4 h-4" />

      <input
        title={label}
        ref={rangeCB}
        type="range"
        min={min}
        max={max}
        value={val}
        step={step}
        onInput={handleInputChange}
        className="range h-[1px] w-full bg-[#D9D9D9] bg-no-repeat"
      ></input>

      <Button icon="plus" onClick={handleIncrement} className="w-4 h-4" />

      <div
        className={`text-xs font-light text-neutral-30 
        ${step <= 0.01 ? "w-14" : step <= 0.1 ? "w-10" : "w-6"}
        `}
      >
        {val}
      </div>
    </div>
  )
}

export default Slider
