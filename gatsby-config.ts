import type { GatsbyConfig } from "gatsby"

require("dotenv").config({
  path: `.env`,
})

const config: GatsbyConfig = {
  siteMetadata: {
    title: `CuppaJoJo`,
    siteUrl: `https://www.cuppajojo.com`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-youtube-v3`,
      options: {
        channelId: ['UCHkGnDn8QgN3UlXgnloP2bg'],
        apiKey: process.env.YOUTUBE_API_KEY, // Optional for public requests
        maxVideos: 50 // Defaults to 50
      },
    },
  ],
}

export default config
