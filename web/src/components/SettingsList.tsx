import { useState } from "react"
import Button from "./Button"
import { IconType } from "./Icon"

type SettingsListProps = {
  icon: IconType
  children: JSX.Element | JSX.Element[]
}

function SettingsList(props: SettingsListProps) {
  const { icon, children } = props

  const [visible, setVisible] = useState(true)

  function handleClick() {
    setVisible(!visible)
  }

  return (
    <div className="">
      <Button onClick={handleClick} icon={icon} className="w-6 h-6" />
      <div
        className={`relative mt-1 flex flex-col gap-1 transition-all duration-200 ease-in-out 
        ${visible ? "max-h-96 overflow-visible" : "max-h-0 overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  )
}

export default SettingsList
