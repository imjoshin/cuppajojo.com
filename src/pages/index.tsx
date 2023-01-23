import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import { Home } from "../components/home"
import { Layout } from "../components/layout"


const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main>
        <Home />
      </main>
    </Layout>
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
