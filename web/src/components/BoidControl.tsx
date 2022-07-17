type BoidControlProps = { label: string }

function BoidControl(props: BoidControlProps) {
  const { label } = props

  return <div>{label}</div>
}

export default BoidControl
