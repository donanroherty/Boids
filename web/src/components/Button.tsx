import Icon, { IconType } from "./Icon"

// Class names in full to enable tailwind static analysis
// fill-boids_btn
// fill-boids_btn_hover
// group-hover:fill-boids_btn_hover
// stroke-boids_btn
// stroke-boids_btn_hover
// group-hover:stroke-boids_btn_hover

type ButtonProps = {
  icon: IconType
  altIcon?: IconType
  useAltIcon?: boolean
  border?: boolean
  onClick?: () => void
  className?: string
}

function Button(props: ButtonProps) {
  const { icon, altIcon, useAltIcon, border, className, onClick } = props

  return (
    <div
      className={`group flex items-center justify-center 
      ${border && "border"} ${className}
      border-boids_btn hover:border-boids_btn_hover rounded solid`}
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
