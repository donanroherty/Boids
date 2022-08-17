import React from "react"
import Icon, { IconType } from "./Icon"

type ButtonProps = {
  icon: IconType
  altIcon?: IconType
  useAltIcon?: boolean
  border?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  className?: string
}

function Button(props: ButtonProps) {
  const { icon, altIcon, useAltIcon, border, className, onClick } = props

  return (
    <div
      className={`group flex items-center justify-center 
      ${border && "border"} ${className} solid
      rounded border-boids_btn hover:border-boids_btn_hover`}
      onClick={onClick}
    >
      <Icon
        type={useAltIcon && altIcon ? altIcon : icon}
        color="boids_btn"
        hoverColor="boids_btn_hover"
      />
    </div>
  )
}

export default Button
