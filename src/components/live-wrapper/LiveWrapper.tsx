
import React, { useEffect, useState } from "react"
import { useLocalStorage } from "../../hooks/use-local-storage"
import { TwitchStatusType, useTwitchStatus } from "../../hooks/use-twitch-status"
import { LivePopup } from "./live-popup"
import * as styles from "./LiveWrapper.module.css"

interface LiveWrapperProps {
  children: React.ReactNode,
}

type StoredStatusType = {
  timestamp: number,
  status: TwitchStatusType,
}

export const LiveWrapper = ({ children }: LiveWrapperProps) => {
  const status = useTwitchStatus()
  const [storedStatus, setStoredStatus] = useLocalStorage<StoredStatusType>(`twitch-status`, { timestamp: 0, status: { live: false, loading: true } })
  const [shouldPopIn] = useState((Math.floor(Date.now() / 1000) - storedStatus.timestamp) > 60)

  useEffect(() => {
    if (!status.loading) {
      setStoredStatus({
        timestamp: Math.floor(Date.now() / 1000),
        status,
      })
    }
  }, [status])

  let statusToShow = status
  if (!shouldPopIn && !status.live) {
    statusToShow = storedStatus.status
  }

  return <>
    <LivePopup status={statusToShow} shouldPopIn={shouldPopIn} />
    {children}
  </>
}