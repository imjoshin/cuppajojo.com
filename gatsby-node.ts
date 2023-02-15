import type { GatsbyNode } from "gatsby"
import socials from "./config/socials.json"
import youtubeVideoGroups from "./config/youtube-video-groups.json"

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

    type YoutubeContentGroup implements Node {
      id: String
      name: String
      tags: [String]
      icon: String
      videos: [YoutubeVideo]
    }
  `)
}

export const sourceNodes: GatsbyNode["sourceNodes"] = ({ actions: { createNode }, createNodeId, createContentDigest, getNodesByType }) => {
  for (const social of socials) {
    console.log(`[Social] Creating ${social.name}`)
    createNode({
      ...social,
      id: createNodeId(social.name),
      internal: {
        type: `Social`,
        contentDigest: createContentDigest(social)
      }
    })
  }

  const youtubeVideos = getNodesByType('YoutubeVideo')

  for (const youtubeVideoGroup of youtubeVideoGroups) {
    const videos: { [key: string]: any }[] = []

    for (const youtubeVideo of youtubeVideos) {
      // @ts-ignore
      const hasTagOfThisGroup = youtubeVideo.tags.filter(t => youtubeVideoGroup.tags.includes(t)).length > 0

      if (hasTagOfThisGroup) {
        videos.push(youtubeVideo)
      }
    }

    if (videos.length) {
      console.log(`[YoutubeContentGroup] Creating ${youtubeVideoGroup.id}`)
      for (const video of videos) {
        console.log(`[YoutubeContentGroup]     ${video.title}`)
      }

      createNode({
        ...youtubeVideoGroup,
        videos,
        internal: {
          type: `YoutubeContentGroup`,
          contentDigest: createContentDigest(youtubeVideoGroup)
        }
      })
    } else {
      console.log(`[YoutubeContentGroup] ERR: ${youtubeVideoGroup.id} - no videos found`)
    }
  }
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createRedirect, createPage } = actions;

  socials.forEach(social => {
    if (social.redirect) {
      createRedirect({
        fromPath: social.path,
        toPath: social.redirect,
      })
    }
  })

  // TODO make this a config item
  createRedirect({
    fromPath: `/sub`,
    toPath: `https://www.twitch.tv/subs/cuppajojo_`,
  })
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