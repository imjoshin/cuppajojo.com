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
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-youtube-v3`,
      options: {
        channelId: ['UCHkGnDn8QgN3UlXgnloP2bg'],
        apiKey: process.env.YOUTUBE_API_KEY, // Optional for public requests
        maxVideos: 100 // Defaults to 50
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "CuppaJoJo",
        short_name: "CuppaJoJo",
        icon: 'src/images/jojo-head-small.png',
        start_url: "/",
        background_color: "#a471cc",
        theme_color: "#a471cc",
        display: "standalone",
        crossOrigin: `use-credentials`,
      },
    },
  ],
}

export default config
