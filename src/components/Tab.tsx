import React from "react"
import Button from "./Button"

type TabProps = {
  color: string
  selected?: boolean
  onSelect: () => void
  onClose: () => void
}

function Tab(props: TabProps) {
  const { color, selected, onSelect, onClose } = props

  function handleCloseTab(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    onClose()
  }

  return (
    <div
      className={`flex items-center pl-1 h-5 gap  border rounded 
      ${selected ? "border-boids_btn" : "border-transparent"}`}
      onClick={onSelect}
    >
      {/* Color label */}
      <div className={`w-20 h-3 rounded`} style={{ backgroundColor: color }}></div>

      {/* Close button */}
      <Button onClick={handleCloseTab} icon="subtract" className="w-5 h-5" />
    </div>
  )
}

export default Tab
