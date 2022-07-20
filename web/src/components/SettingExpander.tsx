import { useEffect, useRef, useState, useCallback } from "react"

type SettingExpanderProps = {
  title: string
  render?: (title: string, hovered: boolean) => JSX.Element | JSX.Element[]
}

function SettingExpander(props: SettingExpanderProps) {
  const { title, render } = props

  // hovered state offers more control than css hover selector when using absolute positioned items (eg. Combo component)
  const [hovered, setHovered] = useState(false)

  const ref = useRef<HTMLDivElement>()
  const cbRef = useCallback((el: HTMLDivElement) => {
    ref.current = el
    if (el) {
      el.addEventListener("mouseenter", handlePointerEnter)
      el.addEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  useEffect(() => {
    return () => {
      document.removeEventListener("mouseenter", handlePointerEnter)
      document.removeEventListener("pointerleave", handlePointerLeave)
    }
  })

  function handlePointerEnter(event: MouseEvent) {
    const contains =
      (ref.current && ref.current.contains(event.target as HTMLElement)) ||
      event.target === ref.current

    setHovered(contains)
  }

  function handlePointerLeave(_: MouseEvent) {
    setHovered(false)
  }

  return (
    <div
      ref={cbRef}
      className={`flex items-center transition-all duration-200 ease-in font-sans font-light border border-transparent rounded-md group text-neutral-600 border-1
        ${
          hovered &&
          "backdrop-blur-[2px] gap-1 bg-neutral-800/80 font-bold border-neutral-700 text-neutral-300"
        }
      `}
    >
      {/* Render props */}
      <div
        className={`origin-left max-w-0 scale-x-0 py-0.5 flex items-center gap-3 transition-all duration-200 ease-in
        ${hovered && "scale-x-100 max-w-md p-0.5"}
        `}
      >
        {render && render(title, hovered)}
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
