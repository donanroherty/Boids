import React, { useRef, useEffect } from "react"
import styled, { css } from "styled-components"

type RangeInputProps = {
  min: number
  max: number
  step: number
  value: number
  setValue: (val: number) => void
}

function RangeInput(props: RangeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    updateBackgroundGradient()
  })

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
    <StyledInput
      ref={inputRef}
      type="range"
      title="slider"
      min={props.min}
      max={props.max}
      step={props.step}
      value={props.value}
      onChange={handleChange}
      className="w-full"
    />
  )
}

const thumb = css`
  --thumb-neutral-color: #2c2c2c;

  position: relative;
  width: 0.75rem;
  height: 0.75rem;

  -webkit-appearance: none;
  background-color: var(--thumb-neutral-color);
  border: 1px solid var(--flock-color);
  border-radius: 50%;
  top: 50%;
  box-shadow: 0px 2px 8px 3px rgba(0, 0, 0, 0.1);
  cursor: ew-resize;
`

const StyledInput = styled.input`
  --track-empty-color: #d9d9d9;

  height: 0.125rem;
  background-color: transparent;
  background-repeat: no-repeat;

  -webkit-appearance: none;
  background-image: linear-gradient(var(--flock-color), var(--flock-color));
  background-size: 70% 100%;
  background-color: var(--track-empty-color);

  /* Track */
  &::-webkit-slider-runnable-track {
    height: 0.25rem;
    width: 100%;

    -webkit-appearance: none;
    background-color: var(--flock-color);
    box-shadow: none;
    border: none;
    background: transparent;
  }

  &::-moz-range-track {
    background-color: var(--track-empty-color);
  }

  &::-moz-range-progress {
    background-color: var(--flock-color);
  }

  /* Thumb */
  &::-webkit-slider-thumb {
    ${thumb}
    transform: translateY(-50%);
  }

  &::-moz-range-thumb {
    ${thumb}
  }
`

export default RangeInput
