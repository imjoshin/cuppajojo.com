import React from 'react';
import * as styles from "./VideoIcon.module.css"

interface VideoIconProps {
  videoId: string
  thumbnail: string
  title: string
  duration: string
}

const convertDurationString = (duration: string) => {
  const seconds = duration.match(/([0-9]+)S/)
  const minutes = duration.match(/([0-9]+)M/)
  const hours = duration.match(/([0-9]+)H/)
  const newDuration = [
    hours && hours[1],
    minutes ? minutes[1].padStart(2, '0') : '00',
    seconds ? seconds[1].padStart(2, '0') : '00',
  ].filter(d => !!d)

  return newDuration.join(':')
}

export const VideoIcon = ({ videoId, thumbnail, title, duration }: VideoIconProps) => {
  const imageStyle = {
    backgroundImage: `url(${thumbnail})`,
  }

  return (
    <a href={`https://youtu.be/${videoId}`} target="_blank" className={styles.videoIcon} style={imageStyle}>
      <div className={styles.duration}>{convertDurationString(duration)}</div>
    </a>
  )
}