import { useEffect, useRef, useState, useCallback } from "react"
import { SettingType } from "../settings"
import ControlComponentBuilder from "./ControlComponentBuilder"

type SettingExpanderProps = {
  property: SettingType
}

function SettingExpander(props: SettingExpanderProps) {
  const { property } = props

  // hovered state offers more control than css hover selector when using absolute positioned items (eg. Combo component)
  const [hovered, setHovered] = useState(false)

  const ref = useRef<HTMLDivElement>()
  const callback = useCallback((el: HTMLDivElement) => {
    ref.current = el
    // setup event listeners for mouse enter/leave
    if (el) {
      el.addEventListener("pointerenter", handleMouseEnter)
      el.addEventListener("pointerleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    // tear down event listeners for mouse enter/leave on unmount
    return () => {
      document.removeEventListener("pointerenter", handleMouseEnter)
      document.removeEventListener("pointerleave", handleMouseLeave)
    }
  })

  function handleMouseEnter(event: MouseEvent) {
    // check if the mouse is over the setting
    const contains =
      (ref.current && ref.current.contains(event.target as HTMLElement)) ||
      event.target === ref.current

    setHovered(contains)
  }

  function handleMouseLeave(_: MouseEvent) {
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
        {/* Create appropriate component for control type */}
        {property.controls.map((control) => {
          return (
            <ControlComponentBuilder
              control={control}
              hidden={!hovered}
              unHover={() => setHovered(false)}
              key={`${property.title}_${control.id}`}
            />
          )
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

export default SettingExpander
