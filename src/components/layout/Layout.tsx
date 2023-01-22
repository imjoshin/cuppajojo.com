import React from "react"
import { LiveWrapper } from "../live-wrapper"
import * as styles from "./Layout.module.css"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <LiveWrapper>
        {children}
      </LiveWrapper>
    </div>
  )
}