import { useEffect, useRef, useState, useCallback } from "react"

type SettingExpanderProps = {
  title: string
  render?: (title: string, hovered: boolean) => JSX.Element | JSX.Element[]
}

function SettingExpander(props: SettingExpanderProps) {
  const { title, render } = props

  // hovered state offers more control than css hover selector when using absolute positioned items (Combo component)
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
      className={`group flex items-center rounded-md py-0.5 font-light text-neutral-600 border border-1 border-transparent
      ${
        hovered &&
        "backdrop-blur-[2px] gap-1 bg-neutral-800/80 px-2 font-bold border-neutral-700 text-neutral-300"
      }
      `}
    >
      <div
        className={`
        transition-all duration-800 ease-in origin-left max-w-0 scale-x-0
        ${hovered && "scale-x-100 max-w-md"}
      `}
      >
        {render && render(title, hovered)}
      </div>

      <div className="font-sans">
        <span className={`relative transition-all opacity-0 ${hovered && "opacity-100"}`}>
          :&nbsp;&nbsp;
        </span>
        <span className={`relative transition-all -left-2 ${hovered && "left-0"}`}>{title}</span>
      </div>
    </div>
  )
}

export default SettingExpander
