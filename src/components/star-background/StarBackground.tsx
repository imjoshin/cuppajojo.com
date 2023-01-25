import React from "react"
import { useRefSize } from "../../hooks/use-ref-size"
import { StarField } from "./star-field"
import * as styles from "./StarBackground.module.css"

const LAYERS = 4

export const StarBackground = () => {
  const ref = React.useRef<HTMLDivElement>();
  const { width, height } = useRefSize(ref)

  const starFields = Array(LAYERS)
    .fill(0)
    .map((_, index) => (
      <StarField
        key={index}
        size={5 - index}
        numStars={(index + 1) * 20}
        duration={(index + 1) * 10}
        width={width}
        height={height}
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
      {starFields}
    </div>

  )
}