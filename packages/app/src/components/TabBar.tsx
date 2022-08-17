import { useState, useEffect, useRef } from "react"
import Button from "./Button"
import Tab from "./Tab"

type TabBarProps = {
  tabData: { color: string }[]
  maxTabs: number
  onAddTab: () => void
  onCloseTab: (index: number) => void
  onSelectTab: (index: number) => void
}

function TabBar(props: TabBarProps) {
  const [selected, setSelected] = useState(0)

  const { onAddTab, onCloseTab, onSelectTab, tabData, maxTabs } = props

  const prevTabData = useRef(tabData)

  // If a new tab is addded, select the last tab
  useEffect(() => {
    if (tabData.length > prevTabData.current.length) handleSelectTab(tabData.length - 1)
    prevTabData.current = tabData
  }, [tabData])

  function handleAddTab() {
    if (tabData.length < maxTabs) onAddTab()
  }

  function handleCloseTab(tab: number) {
    const nextSelectIdx: number =
      tab > selected // If closed tab is right of selected tab
        ? selected // selection remains the same
        : tab < selected // If closed tab is left of selected tab
        ? selected - 1 // decrement selection
        : tab > 0 // If closed tab is not the first tab
        ? tab - 1 // select tab left of closed tab
        : tab + 1 < tabData.length // If closed tab is not the last tab
        ? tab + 1 // select tab right of closed tab
        : -1 // No remaining tabs, select nothing

    setSelected(nextSelectIdx)
    onCloseTab(tab)
  }

  function handleSelectTab(index: number) {
    setSelected(index)
    onSelectTab(index)
  }

  return (
    <div className="flex items-center w-full gap-3">
      <Button icon="plus" border className="w-5 h-5" onClick={handleAddTab} />

      <div className="flex gap-1">
        {tabData.map(({ color }, i) => (
          <Tab
            key={`tab-${i}`}
            selected={selected === i}
            color={color}
            onSelect={() => handleSelectTab(i)}
            onClose={() => handleCloseTab(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default TabBar
