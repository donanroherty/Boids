import React from "react"
import Icon from "./Icon"

type CheckboxProps = {
  checked: boolean
  setChecked: (val: boolean) => void
  color?: string
  className?: string
}

function Checkbox(props: CheckboxProps) {
  const { checked: value, className = "" } = props

  function handleClick() {
    props.setChecked(!value)
  }

  return (
    <div className={`flex items-center gap-2 font-normal ${className}`}>
      <div
        onClick={handleClick}
        className="w-3 h-3 rounded-sm border-[1px] solid border-boids_scene_stroke bg-[#0C8CE9]"
      >
        {value ? (
          <div className="bg-[#0C8CE9] w-full h-full flex justify-center items-center">
            <Icon type="tick" color="white" className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-full bg-white"></div>
        )}
      </div>
    </div>
  )
}

export default Checkbox
