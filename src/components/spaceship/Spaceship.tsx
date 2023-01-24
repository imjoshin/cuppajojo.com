import React from "react"
import * as styles from "./Spaceship.module.css"
import clsx from "clsx"

interface SpaceshipProps {
  passenger: string
  className?: string
}

export const Spaceship = ({ passenger, className }: SpaceshipProps) => {
  return (
    <div className={clsx(styles.spaceship, className)}>
      <div className={styles.behind} />
      <div className={styles.passenger}>
        <div className={styles.passengerImage} style={{ backgroundImage: `url(${passenger})` }} />
      </div>
      <div className={styles.front} />
    </div>
  )
}