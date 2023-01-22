import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Icon } from "../components/icon"


const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      HOME!
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  return (
    <title>CuppaJojo</title>
  )
}
