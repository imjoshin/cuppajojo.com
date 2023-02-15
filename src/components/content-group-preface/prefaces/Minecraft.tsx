import clsx from "clsx"
import React from "react"
import { MinecraftStatusProvider, useMinecraftStatus } from "../../../hooks/use-minecraft-status"
import * as styles from "./Minecraft.module.css"

const Player = ({ avatar, name, delay }: { avatar: string, name: string, delay: number }) => {
  const style = {
    animationDelay: `${delay}s`,
  }

  return (
    <div className={styles.player} style={style}>
      <img className={clsx(styles.playerIcon, styles[name.toLowerCase()])} src={avatar} />
      <div className={styles.playerTag}>
        <div className={styles.playerTagText}>
          {name}
        </div>
      </div>
    </div>
  )
}

const MinecraftDisplay = () => {
  const status = useMinecraftStatus()

  if (!status.online) {
    return null
  }

  const address = (
    <div className={styles.address}>
      {status.address}
    </div>
  )

  const motd = (
    <div
      className={styles.motd}
      dangerouslySetInnerHTML={{ __html: status.motd }}
    />
  )

  const icon = <img src={status.icon} />

  const players = status.players.map((p, i) => (
    <Player
      key={p.name}
      name={p.name}
      avatar={p.avatar}
      delay={i / status.players.length / 2}
    />
  ))

  const playerSection = status.players.length ? (
    <div className={styles.playerSection}>
      <div className={styles.playerInvite}>
        {status.players.length === 1 ? "I'm" : "We're"} online!
      </div>
      <div className={styles.playerContainer}>
        {players}
      </div>
    </div>
  ) : null

  return (
    <div style={{ textAlign: 'center' }}>
      <div className={styles.infoContainer}>
        <div className={styles.icon}>
          {icon}
        </div>
        <div>
          {address}
          {motd}
        </div>
      </div>
      <div className={styles.disclaimer}>
        <a href="/sub" target="_blank">Subscribe</a> to come play with us!
      </div>
      {playerSection}
    </div>
  )
}

export const Minecraft = () => {
  return (
    <MinecraftStatusProvider>
      <MinecraftDisplay />
    </MinecraftStatusProvider>
  )
}