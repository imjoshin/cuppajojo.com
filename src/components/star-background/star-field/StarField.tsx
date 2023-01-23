import React from 'react';
import { motion } from 'framer-motion';
import * as styles from "./StarField.module.css"

// Started from https://stackblitz.com/edit/react-ts-vp9yex?file=Hero.tsx,StarField.tsx

let id = 0;

type Coords = {
  x: number
  y: number
}

interface Props extends React.SVGProps<SVGSVGElement> {
  duration: number
  numStars: number
  size: number
  spread: number
  width: number
  height: number
}

export const StarField: React.FC<Props> = ({
  width,
  height,
  spread = 0,
  size,
  numStars,
  duration,
  ...props
}) => {
  id++
  const [stars, setStars] = React.useState<Coords[]>([])

  const getRandomInt = (max: number): number => {
    // return Math.floor(Math.random() * max);
    return (
      Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) % (max + 1)
    )
  }

  const generateStar = (width: number, height: number): Coords => {
    return { x: getRandomInt(width), y: getRandomInt(height) }
  }

  React.useEffect(() => {
    const stars = Array(numStars)
      .fill(0)
      .map(() => generateStar(width, height));

    setStars(stars);
  }, [width, height]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={styles.starField}
      {...props}
    >
      <defs>
        <linearGradient id={`fade-gradient_${id}`} y2={1} x2="0">
          <stop offset="0" stopColor="white" />
          <stop offset="0.9" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id={`fade-mask_${id}`} maskUnits="userSpaceOnUse">
          <rect
            width={width}
            height={height}
            fill={`url(#fade-gradient_${id})`}
          />
        </mask>

        <filter id={`blur_${id}`}>
          <feGaussianBlur in="FillPaint" stdDeviation="0.5" />
        </filter>
        <g id={`star-field_${id}`} fill="#FFF" filter={`url(#blur_${id})`}>
          {stars.map(({ x, y }, index) => (
            <rect
              key={index}
              width={size}
              height={size}
              x={x}
              y={y}
              transform={`rotate(45 ${x} ${y})`}
            />
          ))}
        </g>
      </defs>

      <g mask={`url(#fade-mask_${id})`} width={width} height={height}>
        <motion.g
          animate={{ x: -width }}
          transition={{
            ease: 'linear',
            duration: duration,
            repeat: Infinity,
          }}
        >
          <use xlinkHref={`#star-field_${id}`} x={0} y={0} />
          <use xlinkHref={`#star-field_${id}`} x={width} y={0} />
        </motion.g>
      </g>
    </svg>
  )
}

