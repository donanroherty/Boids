import React, { useState, useEffect, useRef } from "react"
import Icon from "./Icon"

type ComboProps = {
  options: string[]
  hidden: boolean
  value: string
  setValue: (val: string) => void
  onSelection?: () => void
  color?: string
  className?: string
}

function Combo(props: ComboProps) {
  const { options, hidden = false, value, setValue, className = "", onSelection = () => {} } = props

  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener("click", handleDocClick)
    return () => {
      document.removeEventListener("click", handleDocClick)
    }
  })

  useEffect(() => {
    if (hidden) setIsOpen(false)
  }, [hidden])

  // clicking outside combo closes the combo
  function handleDocClick(event: MouseEvent) {
    if (!ref.current || !event.target) return

    const contains = ref.current.contains(event.target as HTMLElement)
    if (ref.current !== event.target && !contains) {
      setIsOpen(false)
    }
  }

  // clicking the combo box toggles the combo
  function handleClickCombo(event: React.MouseEvent) {
    setIsOpen(!isOpen)
    event.preventDefault()
  }

  function handleClickOption(label: string) {
    setValue(label)
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
            <div>{value}</div>
            <Icon type="downarrow" color="boids_btn" />
          </div>
        </div>
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute z-10 rounded-md top-[1.3rem] w-full border-neutral-800 bg-neutral-700">
          {options
            .filter((opt) => opt !== value)
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
