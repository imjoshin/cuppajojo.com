
import React, { useEffect, useState } from "react"
import { useTwitchStatus } from "../../hooks/use-twitch-status"
import { LivePopup } from "./live-popup"
import * as styles from "./LiveWrapper.module.css"

interface LiveWrapperProps {
  children: React.ReactNode,
}

export const LiveWrapper = ({ children }: LiveWrapperProps) => {
  const status = useTwitchStatus()

  return <>
    <LivePopup status={status} />
    {children}
  </>
}