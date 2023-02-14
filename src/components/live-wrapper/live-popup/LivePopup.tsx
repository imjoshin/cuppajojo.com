import React from "react"
import * as styles from "./LivePopup.module.css"
import clsx from "clsx"
import { graphql, useStaticQuery } from "gatsby"
import { TwitchStatusType } from "../../../hooks/use-twitch-status"

interface LivePopupProps {
  status: TwitchStatusType,
  shouldPopIn: boolean,
}

// TODO the animation out isn't clean, the content disappears. Oh well!
export const LivePopup = ({ status, shouldPopIn }: LivePopupProps) => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  let popupContent = null;

  if (status.live) {
    popupContent = <>
      <div className={styles.content}>
        <div className={styles.title}>{site.siteMetadata.title} is live!</div>
        <div className={styles.stream}>
          <div className={styles.gameThumbnail} style={{
            backgroundImage: `url(${status.gameThumbnail})`
          }}></div>
          <div className={styles.streamInfo}>
            <div className={styles.streamGame}>{status.game}</div>
            <div className={styles.streamTitle}>{status.title}</div>
            <div className={styles.streamViewers}>{status.viewers} Viewer{status.viewers === 1 ? '' : 's'}</div>
          </div>
        </div>
      </div>
      <div className={styles.background} style={{
        backgroundImage: `url(${status.thumbnail})`
      }}></div>
      <div className={styles.backdrop}></div>
    </>
  }

  return (
    <a href={`https://www.twitch.tv/${status.live ? status.user : ''}`} target="_blank">
      <div
        className={clsx(styles.livePopup, !status.live && styles.livePopupHidden, shouldPopIn && styles.livePopupAnimate)}
      >
        {popupContent}
      </div>
    </a>
  )
}