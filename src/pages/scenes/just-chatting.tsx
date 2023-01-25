import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { Home } from "../../components/home"
import { Layout } from "../../components/layout"
import { SEO } from "../../components/seo"


const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout liveNotification={false}>
      <main>
        <Home hideSocials hideCenterpiece />
      </main>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  return <SEO />
}
