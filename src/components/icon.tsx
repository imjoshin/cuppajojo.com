import React from "react"
import {
  FaDiscord,
  FaInstagram,
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa"

const ICON_MAP = {
  discord: FaDiscord,
  instagram: FaInstagram,
  twitch: FaTwitch,
  youtube: FaYoutube,
  twitter: FaTwitter,
  tiktok: FaTiktok,
}

interface IconProps {
  i: keyof typeof ICON_MAP,
  size?: number,
}

export const Icon = ({ i: iconName, size }: IconProps) => {
  const IconComponent = ICON_MAP[iconName]

  // @ts-ignore
  return <IconComponent size={size} />
}