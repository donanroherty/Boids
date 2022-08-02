import { useRef, useCallback } from "react"
import Button from "./Button"
import "./slider.css"

type SliderProps = {
  title?: string
  min: number
  max: number
  step: number
  value: number
  setValue: (val: number) => void
  color?: string
  className?: string
}

function Slider(props: SliderProps) {
  const { title = "slider", min = 0, max = 100, step = 1, value, color, className = "" } = props

  const rangeRef = useRef<HTMLInputElement>()
  const rangeCB = useCallback((el: HTMLInputElement) => {
    rangeRef.current = el
    updateBackgroundGradient()
  }, [])

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    updateBackgroundGradient()
    props.setValue(parseFloat(e.currentTarget.value))
    e.preventDefault()
  }

  function handleIncrement() {
    props.setValue(Math.min(max, value + step))
  }

  function handleDecrement() {
    props.setValue(Math.max(min, value - step))
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
    <div
      style={{ "--flock-color": `${color}` } as React.CSSProperties}
      className={`flex items-center w-40 h-full gap-1 select-none ${className}`}
    >
      <Button icon="subtract" onClick={handleDecrement} className="w-4 h-4" />

      <input
        title={title}
        ref={rangeCB}
        type="range"
        min={min}
        max={max}
        value={value}
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
        {value}
      </div>
    </div>
  )
}

export default Slider
