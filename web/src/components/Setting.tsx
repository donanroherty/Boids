import { useEffect, useRef, useState, useCallback } from "react"
import { ComboProperties, SettingType, SliderProperties } from "../settings"
import Checkbox from "./Checkbox"
import Combo from "./Combo"
import Slider from "./Slider"

type SettingExpanderProps = {
  property: SettingType
}

function Setting(props: SettingExpanderProps) {
  const { property } = props

  // hovered state offers more control than css hover selector when using absolute positioned items (eg. Combo component)
  const [hovered, setHovered] = useState(false)

  const ref = useRef<HTMLDivElement>()
  const callback = useCallback((el: HTMLDivElement) => {
    ref.current = el
    if (el) {
      el.addEventListener("pointerenter", handleMouseEnter)
      el.addEventListener("pointerleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    return () => {
      document.removeEventListener("pointerenter", handleMouseEnter)
      document.removeEventListener("pointerleave", handleMouseLeave)
    }
  })

  function handleMouseEnter(event: MouseEvent) {
    const contains =
      (ref.current && ref.current.contains(event.target as HTMLElement)) ||
      event.target === ref.current

    setHovered(contains)
  }

  function handleMouseLeave(_: MouseEvent) {
    setHovered(false)
  }

  function onComboSelection() {
    setHovered(false)
  }

  return (
    <div
      ref={callback}
      className={`flex items-center transition-all duration-200 ease-in font-sans font-light border border-transparent rounded-md group text-neutral-600 border-1
    ${
      hovered &&
      "backdrop-blur-[2px] gap-1 bg-neutral-800/80 font-bold border-neutral-700 text-neutral-300"
    }
    `}
    >
      <div
        className={`font-light origin-left max-w-0 scale-x-0 py-0.5 flex items-center gap-2 transition-all duration-200 ease-in
        ${hovered && "scale-x-100 max-w-md p-0.5"}`}
      >
        {/* Create property controls */}
        {property.controls.map((control) => {
          if (control.type === "slider") {
            return (
              <div key={`${property.title}_${control.id}`} className="flex justify-center gap-1">
                {control.label && control.label}
                <Slider
                  className={control.className}
                  label={control.label}
                  min={(control.properties as SliderProperties).min}
                  max={(control.properties as SliderProperties).max}
                  step={(control.properties as SliderProperties).step}
                />
              </div>
            )
          }

          if (control.type === "combo") {
            return (
              <div key={`${property.title}_${control.id}`} className="flex justify-center gap-1">
                {control.label && control.label}
                <Combo
                  className={control.className}
                  label={control.label}
                  options={(control.properties as ComboProperties).options}
                  hidden={!hovered}
                  onSelection={onComboSelection}
                />
              </div>
            )
          }

          if (control.type === "checkbox") {
            return (
              <div key={`${property.title}_${control.id}`} className="flex justify-center gap-1">
                {control.label && control.label}
                <Checkbox className={control.className} label={control.label} />
              </div>
            )
          }

          return null
        })}
      </div>

      {/* Property title */}
      <div
        className={`flex items-center h-full py-0.5 pr-2 
          ${hovered && "border-l border-neutral-700 pl-2"}
        `}
      >
        {property.title}
      </div>
    </div>
  )
}

export default Setting
