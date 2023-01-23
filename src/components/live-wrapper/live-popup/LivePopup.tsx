import React from "react"
import * as styles from "./LivePopup.module.css"
import clsx from "clsx"
import { StatusType } from "../LiveWrapper"

interface LivePopupProps {
  status: StatusType,
}

// TODO the animation out isn't clean, the content disappears. Oh well!
export const LivePopup = ({ status }: LivePopupProps) => {
  let popupContent = null;

  if (status.live) {
    popupContent = <>
      <div className={styles.content}>
        <div className={styles.title}>CuppaJoJo is live!</div>
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

  console.log(status)

  return (
    <a href="https://www.twitch.tv/CuppaJoJo_" target="_blank">
      <div
        className={clsx(styles.livePopup, !status.live && styles.livePopupHidden)}
      >
        {popupContent}
      </div>
    </a>
  )
}