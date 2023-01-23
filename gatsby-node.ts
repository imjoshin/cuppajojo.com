import type { GatsbyNode } from "gatsby"
import socials from "./socials.json"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type Social implements Node {
      name: String
      icon: String
      path: String
      redirect: String
    }
  `)
}

export const sourceNodes: GatsbyNode["sourceNodes"] = ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  socials.map(social => createNode({
    ...social,
    id: createNodeId(social.name),
    internal: {
      type: `Social`,
      contentDigest: createContentDigest(social)
    }
  }));
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createRedirect } = actions;

  socials.forEach(social =>
    createRedirect({
      fromPath: social.path,
      toPath: social.redirect,
    })
  )
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  // Find all Home images
  if (node.parent) {
    const parent = getNode(node.parent)

    if (node.internal.type === `ImageSharp`) {
      const absolutePath = parent!.absolutePath as string
      const isHomeImage = absolutePath.indexOf("src/images/home") >= 0

      createNodeField({
        node,
        name: `isHomeImage`,
        value: isHomeImage,
      })
    }
  }
}