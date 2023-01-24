import React from "react"
import { useRefSize } from "../../hooks/use-ref-size";
import * as styles from "./ContentBackground.module.css"

interface ContentBackgroundProps {
  layers?: number
}

export const ContentBackground = ({ layers = 4 }: ContentBackgroundProps) => {
  const ref = React.useRef<HTMLDivElement>();
  const { width, height } = useRefSize(ref)

  return (
    // @ts-ignore
    <div className={styles.contentBackground} ref={ref}>

    </div>
  )
}