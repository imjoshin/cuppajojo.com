import React from "react"
import { TwitchStatusProvider } from "../../hooks/use-twitch-status"
import { LiveWrapper } from "../live-wrapper"
import { StarBackground } from "../star-background"
import * as styles from "./Layout.module.css"

interface LayoutProps {
  children: React.ReactNode,
  starField?: boolean,
  liveNotification?: boolean,
}

export const Layout = ({ children, starField = true, liveNotification = true }: LayoutProps) => {
  let renderChildren = children

  if (starField) {
    renderChildren = <>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {renderChildren}
      </div>
      {starField && <div className={styles.starBackground}>
        <StarBackground />
      </div>}
    </>
  }

  if (liveNotification) {
    renderChildren = (
      <LiveWrapper>
        {renderChildren}
      </LiveWrapper>
    )
  }

  return (
    <TwitchStatusProvider>
      <div className={styles.layout}>
        {renderChildren}
      </div>
    </TwitchStatusProvider>
  )
}