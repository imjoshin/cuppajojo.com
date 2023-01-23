
import React, { useEffect, useState } from "react"
import { LivePopup } from "./live-popup"
import * as styles from "./LiveWrapper.module.css"

interface LiveWrapperProps {
  children: React.ReactNode,
}

export type StatusType = { live: false } | {
  live: true,
  game: string,
  title: string,
  viewers: number,
  started: string,
  thumbnail: string,
  gameThumbnail: string,
}

export const LiveWrapper = ({ children }: LiveWrapperProps) => {
  const [status, setStatus] = useState<StatusType>({ live: false })

  // set up interval and fetch status
  useEffect(() => {
    const fetchStatus = async () => {
      const response = await window
        .fetch(`/api/status`, {
          method: `GET`,
          headers: {
            "content-type": "application/json",
          },
        })
        .then(res => res.json())

      setStatus(response)
    }

    fetchStatus()

    // fetch status every 30 seconds
    const interval = setInterval(fetchStatus, 5 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <>
    <LivePopup status={status} />
    {children}
  </>
}