import React from "react"
import { StarField } from "./star-field"
import * as styles from "./StarBackground.module.css"

interface StarBackgroundProps {
  layers?: number
}

export const StarBackground = ({ layers = 4 }: StarBackgroundProps) => {
  const ref = React.useRef<HTMLDivElement>();
  const [width, setWidth] = React.useState<number>(512);
  const [height, setHeight] = React.useState<number>(512);
  const spread = 50;
  const duration = 45;

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }, []);

  const starFields = Array(layers)
    .fill(0)
    .map((_, index) => (
      <StarField
        key={index}
        width={width}
        height={height}
        spread={spread}
        size={5 - index}
        numStars={(index + 1) * 20}
        duration={(index + 1) * duration / 4}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    ))

  // TODO move these styles to CSS

  return (
    <div
      // @ts-ignore
      ref={ref}
      className={styles.starBackground}
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {starFields}
      </div>
    </div>

  )
}