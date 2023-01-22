import React from "react"
import * as styles from "./LivePopup.module.css"
import clsx from "clsx"
import { StatusType } from "../LiveWrapper"

interface LivePopupProps {
  status: StatusType,
}

// TODO the animation out isn't clean, the content disappears. Oh well!
export const LivePopup = ({ status }: LivePopupProps) => {
  return (
    <div className={clsx(styles.livePopup, !status.live && styles.livePopupHidden)}>
      <div className={styles.title}>CuppaJoJo is live now!</div>
      {JSON.stringify(status)}
    </div>
  )
}