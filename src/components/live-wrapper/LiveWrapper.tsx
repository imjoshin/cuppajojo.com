
import React from "react"
import * as styles from "./LiveWrapper.module.css"

interface LiveWrapperProps {
  children: React.ReactNode,
}

export const LiveWrapper = ({ children }: LiveWrapperProps) => {
  return (
    <div>
      {children}
    </div>
  )
}