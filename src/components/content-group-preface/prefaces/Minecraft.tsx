import React from "react"
import { MinecraftStatusProvider, useMinecraftStatus } from "../../../hooks/use-minecraft-status"

const MinecraftDisplay = () => {
  const status = useMinecraftStatus()

  if (!status.online) {
    return null
  }

  const motd = (
    <div>
      <div dangerouslySetInnerHTML={{ __html: status.motd }} />
    </div>
  )
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={status.icon} /><br />
      {motd}
      Address: {status.address}<br />
      Version: {status.version}<br />
      Player Count: {status.players.length} / {status.maxPlayers}<br />
      Players: {JSON.stringify(status.players)}<br />
    </div>
  )
}

export const Minecraft = () => {
  return null
  return (
    <MinecraftStatusProvider>
      <MinecraftDisplay />
    </MinecraftStatusProvider>
  )
}