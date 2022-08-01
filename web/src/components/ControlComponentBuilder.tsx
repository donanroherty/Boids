import { ComboProperties, Control, SettingType, SliderProperties } from "../settings"
import Checkbox from "./Checkbox"
import Combo from "./Combo"
import Slider from "./Slider"

type ControlProps = {
  control: Control
  hidden: boolean
  unHover: () => void
}

// ControlComponent creates an appropriate component for a given control type
function ControlComponentBuilder(props: ControlProps) {
  const { control, hidden, unHover } = props

  function onComboSelection() {
    unHover()
  }

  return (
    <>
      {(function makeControlComponent() {
        switch (control.type) {
          case "slider":
            return (
              <div className="flex justify-center gap-1">
                {control.label && control.label}
                <Slider
                  className={control.className}
                  label={control.label}
                  min={(control.properties as SliderProperties).min}
                  max={(control.properties as SliderProperties).max}
                  step={(control.properties as SliderProperties).step}
                />
              </div>
            )
          case "combo":
            return (
              <div className="flex justify-center gap-1">
                {control.label && control.label}
                <Combo
                  className={control.className}
                  label={control.label}
                  options={(control.properties as ComboProperties).options}
                  hidden={hidden}
                  onSelection={onComboSelection}
                />
              </div>
            )
          case "checkbox":
            return (
              <div className="flex justify-center gap-1">
                {control.label && control.label}
                <Checkbox className={control.className} label={control.label} />
              </div>
            )
          default:
            return null
        }
      })()}
    </>
  )
}

export default ControlComponentBuilder
