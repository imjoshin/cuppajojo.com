import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Layout } from "../components/layout"


const pageStyles = {
  color: "#FFFFFF",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#000000",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <main style={pageStyles}>
        <div>
          <h1 style={headingStyles}>Page not found</h1>
          <p style={paragraphStyles}>
            Sorry, we couldn’t find what you were looking for.
            <br />
            <br />
            <StaticImage src="../images/jojo-irl-sad.png" alt="Sad Jojo" />
            <br />
            <br />
            {process.env.NODE_ENV === "development" ? (
              <>
                <br />
                Try creating a page in <code style={codeStyles}>src/pages/</code>.
                <br />
              </>
            ) : null}
            <br />
            <Link to="/">Go home</Link>.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
