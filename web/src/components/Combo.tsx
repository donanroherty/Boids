import { useState, useEffect, useRef } from "react"
import Icon from "./Icon"

type ComboProps = {
  label?: string
  defaultSelectionIdx?: number
  options: string[]
  hidden: boolean
  className?: string
  onSelection?: () => void
}

function Combo(props: ComboProps) {
  const {
    label = "combo",
    defaultSelectionIdx = 1,
    options,
    hidden = false,
    className = "",
    onSelection = () => {},
  } = props

  const [selected, setSelected] = useState(defaultSelectionIdx)
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
    onSelection()
  }

  return (
    <div ref={ref} className={`relative flex  text-boids_btn_hover w-32 ${className}`}>
      {/* Selection */}
      <div
        className="w-full p-1 rounded-md border-neutral-800 bg-neutral-700"
        onClick={handleClickCombo}
      >
        <div className="flex items-center justify-between h-3 p-1">
          <div className="flex items-center justify-between w-full h-full px-2 rounded-md">
            <div>{options[selected]}</div>
            <Icon type="downarrow" color="boids_btn" />
          </div>
        </div>
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute z-10 rounded-md top-[1.3rem] w-full border-neutral-800 bg-neutral-700">
          {options
            .filter((_, i) => i !== selected)
            .map((opt) => (
              <div
                className="flex items-center justify-between h-8 p-1"
                key={opt}
                onClick={() => handleClickOption(opt)}
              >
                <div className="flex items-center justify-between w-full h-full px-2 rounded-m hover:bg-neutral-600">
                  <div>{opt}</div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Combo
