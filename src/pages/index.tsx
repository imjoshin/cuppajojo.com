import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
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
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )

  return (
    <title>{site.siteMetadata.title}</title>
  )
}
