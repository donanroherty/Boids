import { useState, useEffect, useRef } from "react"
import Icon, { IconType } from "./Icon"

type ComboProps = {
  defaultSelectionIdx?: number
  options: string[]
  hidden: boolean
  className?: string
}

function Combo(props: ComboProps) {
  const { defaultSelectionIdx: selectedIdx = 1, options, hidden = false, className } = props

  const [selected, setSelected] = useState(selectedIdx)
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener("click", handleDocClick)
    return () => {
      document.removeEventListener("click", handleDocClick)
    }
  })

  useEffect(() => {
    if (hidden) {
      setIsOpen(false)
    }
  }, [hidden])

  function handleDocClick(event: MouseEvent) {
    if (!ref.current || !event.target) return

    const contains = ref.current.contains(event.target as HTMLElement)
    if (ref.current !== event.target && !contains) {
      setIsOpen(false)
    }
  }

  function handleClickCombo(event: React.MouseEvent) {
    setIsOpen(!isOpen)
    event.preventDefault()
  }

  function handleClickOption(label: string) {
    const idx = options.findIndex((o) => o === label)
    setSelected(idx)
    setIsOpen(false)
  }

  function item(label: string, isSelection: boolean, icon?: IconType) {
    return (
      <div
        className="flex items-center justify-between h-6"
        key={label}
        onClick={() => handleClickOption(label)}
      >
        <div
          className={`
          flex items-center justify-between w-full h-full px-2 rounded-md 
          ${!isSelection && "hover:bg-neutral-600"}
        `}
        >
          <div>{label}</div>
          {icon && <Icon type="downarrow" color="boids_btn" />}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`${className && className} relative flex w-full text-boids_btn_hover`}
    >
      {/* Selection */}
      <div
        className="w-full p-1 rounded-md border-neutral-800 bg-neutral-700"
        onClick={handleClickCombo}
      >
        {item(options[selected], true, "downarrow")}
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute p-1 z-10 rounded-md -bottom-[3.7rem] w-28 border-neutral-800 bg-neutral-700">
          {options.filter((_, i) => i !== selected).map((opt) => item(opt, false))}
        </div>
      )}
    </div>
  )
}

export default Combo
