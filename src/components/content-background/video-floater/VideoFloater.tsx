
import { graphql, useStaticQuery } from "gatsby";
import React, { useState } from "react"
import * as styles from "./VideoFloater.module.css"

interface VideoFloaterProps {
  image: string,
  id: string,
  height: number,
}

const ROTATE_DURATION = {
  max: 15,
  min: 5,
}

const MOVE_DURATION = {
  max: 30,
  min: 10,
}

const WIDTH_SIZE = {
  max: 8,
  min: 12,
}

export const VideoFloater = ({ image, id, height }: VideoFloaterProps) => {
  const [rotateDuration] = useState(`${Math.floor(Math.random() * (ROTATE_DURATION.max - ROTATE_DURATION.min + 1) + ROTATE_DURATION.min)}s`)
  const [moveDuration] = useState(`${Math.floor(Math.random() * (MOVE_DURATION.max - MOVE_DURATION.min + 1) + MOVE_DURATION.min)}s`)
  const [width] = useState(Math.floor(Math.random() * (WIDTH_SIZE.max - WIDTH_SIZE.min + 1) + WIDTH_SIZE.min))
  const [cometMask] = useState(Math.floor(Math.random() * (7) + 1))

  const imageStyle = {
    backgroundImage: `url(${image})`,
    '--rotate-duration': rotateDuration,
    '--mask-image': `url("/images/comets/comet${cometMask}.png")`
  }

  const floaterStyle = {
    top: `${height}%`,
    '--move-duration': moveDuration,
    '--width': `${width}%`,
  }

  return (
    <a href={`https://youtu.be/${id}`} target="_blank" className={styles.floaterContainer} style={floaterStyle}>
      <div className={styles.floater} style={imageStyle} />
    </a>
  )
}