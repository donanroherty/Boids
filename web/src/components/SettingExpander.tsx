import { useEffect, useRef, useState, useCallback } from "react"

type SettingExpanderProps = {
  title: string
  content: (hovered: boolean, unhover: () => void) => JSX.Element | JSX.Element[]
}

// SettingExpander wraps child components which are rendered when the expander is hovered.
function SettingExpander(props: SettingExpanderProps) {
  const { title, content } = props

  const [hovered, setHovered] = useState(false)

  const ref = useRef<HTMLDivElement>()
  const callback = useCallback((el: HTMLDivElement) => {
    ref.current = el
    if (el) {
      // setup event listeners for mouse enter/leave
      el.addEventListener("pointerenter", handleMouseEnter)
      el.addEventListener("pointerleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    return () => {
      // tear down event listeners for mouse enter/leave on unmount
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
        {/* Render content */}
        {content(hovered, () => setHovered(false))}
      </div>

      {/* Property title */}
      <div
        className={`flex items-center h-full py-0.5 pr-2 
         ${hovered && "border-l border-neutral-700 pl-2"}
        `}
      >
        {title}
      </div>
    </div>
  )
}

export default SettingExpander
