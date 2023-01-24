import { relative } from "path"
import React from "react"
import { TwitchStatusProvider } from "../../hooks/use-twitch-status"
import { ContentBackground } from "../content-background"
import { LiveWrapper } from "../live-wrapper"
import { StarBackground } from "../star-background"
import * as styles from "./Layout.module.css"

interface LayoutProps {
  children: React.ReactNode,
  starField?: boolean,
  content?: boolean,
}

export const Layout = ({ children, starField = true, content = true }: LayoutProps) => {
  let renderChildren = children

  if (starField || content) {
    renderChildren = <>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {renderChildren}
      </div>
      {starField && <div className={styles.background}>
        <StarBackground />
      </div>}
      {content && <div className={styles.background}>
        <ContentBackground />
      </div>}
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