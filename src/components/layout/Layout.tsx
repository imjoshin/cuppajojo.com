import { relative } from "path"
import React from "react"
import { TwitchStatusProvider } from "../../hooks/use-twitch-status"
import { LiveWrapper } from "../live-wrapper"
import { StarBackground } from "../star-background"
import * as styles from "./Layout.module.css"

interface LayoutProps {
  children: React.ReactNode,
  starField?: boolean,
}

export const Layout = ({ children, starField = true }: LayoutProps) => {
  let renderChildren = children

  if (starField) {
    renderChildren = <>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      <div className={styles.background}>
        <StarBackground />
      </div>
    </>
  }

  return (
    <TwitchStatusProvider>
      <div className={styles.layout}>
        <LiveWrapper>
          {renderChildren}
        </LiveWrapper>
      </div>
    </TwitchStatusProvider>
  )
}