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
    // push two so when the animation repeats, there's a star already in the same place
    boxShadow.push(`${star.x}px ${star.y}px var(--box-shadow-size) var(--box-shadow-size) #FFFFFF`)
    boxShadow.push(`${star.x + width}px ${star.y}px var(--box-shadow-size) var(--box-shadow-size) #FFFFFF`)
  }

  const style = {
    "--box-shadow-size": `${size / 2}px`,
    "--size": `0.1px`,
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

