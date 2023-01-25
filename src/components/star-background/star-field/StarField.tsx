import React from 'react';
import * as styles from "./StarField.module.css"

type Coords = {
  x: number,
  y: number,
}

interface StarFieldProps {
  duration: number
  numStars: number
  size: number
  width: number
  height: number
}

export const StarField = ({ numStars, duration, size, width, height }: StarFieldProps) => {
  const [stars, setStars] = React.useState<Coords[]>([])

  React.useEffect(() => {
    const stars = Array(numStars)
      .fill(0)
      .map(() => ({
        x: Math.floor(Math.random() * width) + 1,
        y: Math.floor(Math.random() * height) + 1,
      }));

    setStars(stars);
  }, [numStars, width, height]);

  let boxShadow: string[] = []

  for (const star of stars) {
    boxShadow.push(`${star.x}px ${star.y}px #FFFFFF`)
    boxShadow.push(`${star.x + width}px ${star.y}px #FFFFFF`)
  }

  const style = {
    "--size": `${size}px`,
    "--fade": `${size}s`,
    "--duration": `${duration}s`,
    "--box-shadow": boxShadow.join(`, `),
    "--page-width": `${width}px`,
  }

  return (
    <div
      className={styles.starField}
      // @ts-ignore
      style={style}
    >

    </div>
  )
}

