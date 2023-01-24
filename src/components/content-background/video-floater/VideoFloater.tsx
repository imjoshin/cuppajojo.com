
import { graphql, useStaticQuery } from "gatsby";
import React from "react"
import * as styles from "./VideoFloater.module.css"

interface VideoFloaterProps {
  image: string,
  id: string,
  height: number,
}

export const VideoFloater = ({ image, id, height }: VideoFloaterProps) => {
  const imageStyle = {
    backgroundImage: `url(${image})`
  }

  const floaterStyle = {
    top: `${height}%`
  }

  return (
    <a href={`https://youtu.be/${id}`} target="_blank" className={styles.floaterContainer} style={floaterStyle}>
      <div className={styles.floater} style={imageStyle} />
    </a>
  )
}