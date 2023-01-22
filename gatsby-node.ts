import type { GatsbyNode } from "gatsby"
import redirects from "./redirects.json"

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createRedirect } = actions;

  redirects.forEach(redirect =>
    createRedirect({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
    })
  )
}