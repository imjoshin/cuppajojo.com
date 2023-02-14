import React from "react"
import { Minecraft } from "./prefaces/Minecraft"

const PREFACE_MAP: { [key: string]: () => JSX.Element } = {
  minecraft: Minecraft,
}

interface ContentGroupPrefaceProps {
  name: string
}

export const ContentGroupPreface = ({ name }: ContentGroupPrefaceProps) => {
  const Component = PREFACE_MAP[name.toLowerCase()]
  if (Component !== undefined) {
    return <Component />
  }

  return null;
}