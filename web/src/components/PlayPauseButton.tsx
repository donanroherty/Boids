import Icons from "./Icons"

type PlayPauseButtonProps = {
  isPaused: boolean
}

function PlayPauseButton(props: PlayPauseButtonProps) {
  const { isPaused } = props

  return (
    <div>
      <Icons type={isPaused ? "play" : "pause"} />
    </div>
  )
}

export default PlayPauseButton
