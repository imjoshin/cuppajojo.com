import React, { MutableRefObject } from "react";

const DEFAULT_SIZE = 512

export const useRefSize = (ref: MutableRefObject<any>) => {
  const [width, setWidth] = React.useState<number>(DEFAULT_SIZE)
  const [height, setHeight] = React.useState<number>(DEFAULT_SIZE)

  React.useLayoutEffect(() => {
    const measure = () => {
      setWidth(ref.current?.offsetWidth || DEFAULT_SIZE)
      setHeight(ref.current?.offsetHeight || DEFAULT_SIZE)
    }

    measure()
    window.addEventListener("resize", measure)

    return () => {
      window.removeEventListener("resize", measure)
    }
  }, [])

  return { width, height }
}