import clsx from "clsx"
import React from "react"
import {
  FaDiscord,
  FaInstagram,
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa"

import * as styles from "./Icon.module.css"

const ICON_MAP = {
  discord: FaDiscord,
  instagram: FaInstagram,
  twitch: FaTwitch,
  youtube: FaYoutube,
  twitter: FaTwitter,
  tiktok: FaTiktok,
}

const STYLED_IMAGE_ICONS = [
  'minecraft',
]

interface IconProps {
  i: keyof typeof ICON_MAP,
  size?: number,
}

export const Icon = ({ i: iconName, size }: IconProps) => {
  const IconComponent = ICON_MAP[iconName]

  if (IconComponent) {
    return <IconComponent size={size} />
  } else if (STYLED_IMAGE_ICONS.indexOf(iconName) >= 0) {
    return (
      <div className={clsx(styles[iconName], styles.imageIcon, "imageIcon")} />
    )
  }

  return undefined
}