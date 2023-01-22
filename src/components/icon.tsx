import React from "react"
import { FaDiscord, FaInstagram } from "react-icons/fa"

const ICON_MAP = {
  'discord': FaDiscord,
  'instagram': FaInstagram,
}

interface IconProps {
  i: keyof typeof ICON_MAP,
}

export const Icon = ({ i: iconName }: IconProps) => {
  const IconComponent = ICON_MAP[iconName]

  // @ts-ignore
  return <IconComponent />
}