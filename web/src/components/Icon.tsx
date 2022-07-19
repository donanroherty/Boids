export type IconType = "settings" | "controller" | "play" | "pause" | "plus" | "subtract" | "reset"

type IconsProps = {
  color: string
  hoverColor?: string
  type: IconType
  className?: string
}

function Icon(props: IconsProps) {
  let { type, color, hoverColor, className } = props
  if (!hoverColor) hoverColor = color

  function getColorClasses(fill: boolean) {
    const prefix = fill ? "fill" : "stroke"
    const c = `${prefix}-${color}`
    const h = `group-hover:${prefix}-${hoverColor}`
    return `${c} ${h}`
  }

  return (
    <div className={`group ${className && className}`}>
      {type === "controller"
        ? controllerIcon(getColorClasses(false))
        : type === "settings"
        ? settingsIcon(getColorClasses(false))
        : type == "play"
        ? playIcon(getColorClasses(true))
        : type == "pause"
        ? pauseIcon(getColorClasses(true))
        : type === "subtract"
        ? subtractIcon(getColorClasses(false))
        : type === "plus"
        ? plusIcon(getColorClasses(false))
        : type === "reset"
        ? resetIcon(getColorClasses(false))
        : null}
    </div>
  )
}

export default Icon

function plusIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 8 8">
      <path className={colorClasses} d="M0 3.944h8M3.944 8V0" />
    </svg>
  )
}

function subtractIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="1" fill="none" viewBox="0 0 9 1">
      <path className={colorClasses} d="M0 .5h9" />
    </svg>
  )
}

function playIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="27" fill="none" viewBox="0 0 24 27">
      <path
        className={colorClasses}
        d="M0 3.935C0 1.685 2.384.236 4.381 1.272l17.82 9.24c2.09 1.084 2.174 4.043.149 5.244L4.53 26.316C2.53 27.5 0 26.06 0 23.735v-19.8Z"
      />
    </svg>
  )
}
function pauseIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30">
      <rect width="12.273" height="30" className={colorClasses} rx="3" />
      <rect width="12.273" height="30" x="17.727" className={colorClasses} rx="3" />
    </svg>
  )
}

function settingsIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        className={colorClasses}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
      <path
        className={colorClasses}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.622 10.395-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 18.831 18 20 18 20l2-2-1.484-1.75 1.098-2.652 2.386-.62V11l-2.378-.605Z"
      />
    </svg>
  )
}

function controllerIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="13" fill="none" viewBox="0 0 26 13">
      <path
        className={colorClasses}
        d="M6.25.5h12.503a5.75 5.75 0 1 1-4.107 9.775l-.148-.15h-3.995l-.147.15A5.749 5.749 0 1 1 6.251.5Zm3.655 6.904a.969.969 0 0 0 .283-.685V5.78a.969.969 0 0 0-.968-.968H7.688V3.28a.969.969 0 0 0-.968-.969h-.938a.969.969 0 0 0-.969.97v1.53h-1.53a.969.969 0 0 0-.97.97v.937a.969.969 0 0 0 .97.968h1.53V9.22a.969.969 0 0 0 .97.969h.937a.969.969 0 0 0 .968-.97v-1.53H9.22a.969.969 0 0 0 .685-.284ZM16.98 9.84a2.063 2.063 0 1 0 2.292-3.431 2.063 2.063 0 0 0-2.292 3.43Zm2.5-3.75a2.063 2.063 0 1 0 2.292-3.43 2.063 2.063 0 0 0-2.292 3.43Z"
      />
    </svg>
  )
}

function resetIcon(colorClasses: string) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 15 15">
      <path
        className={colorClasses}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.23 5A6.252 6.252 0 0 0 1.28 6.875"
      />
      <path
        className={colorClasses}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.625 5h2.75a.375.375 0 0 0 .375-.375v-2.75M1.8 10a6.251 6.251 0 0 0 11.95-1.875"
      />
      <path
        className={colorClasses}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.406 10h-2.75a.375.375 0 0 0-.375.375v2.75"
      />
    </svg>
  )
}
