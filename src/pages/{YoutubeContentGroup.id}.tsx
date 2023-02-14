import React from "react"
import { graphql, HeadFC, PageProps, HeadProps } from "gatsby"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { VideoIcon } from "../components/video-icon"
import { ContentGroupPreface } from "../components/content-group-preface"

type DataProps = {
  youtubeContentGroup: {
    id: string,
    icon: string,
    name: string,
    videos: {
      thumbnail: {
        url: string
      },
      videoId: string,
      title: string,
      duration: string,
      publishedAt: string,
    }[]
  }
}

export default function ContentGroupPage({ data }: PageProps<DataProps>) {
  // TODO move this to a css file somewhere
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 auto',
    maxWidth: '1600px',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '2rem',
    margin: '3rem',
  }

  const videos = data.youtubeContentGroup.videos.sort((a, b) =>
    // @ts-ignore
    new Date(b.publishedAt) - new Date(a.publishedAt)
  )

  return (
    <Layout>
      <div style={titleStyle}>
        {data.youtubeContentGroup.name}
      </div>
      <ContentGroupPreface name={data.youtubeContentGroup.name} />
      <div style={containerStyle}>
        {videos.map(video => (
          <VideoIcon
            key={video.videoId}
            videoId={video.videoId}
            thumbnail={video.thumbnail.url}
            title={video.title}
            duration={video.duration}
          />
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String) {
    youtubeContentGroup(id: { eq: $id }) {
      id
      icon
      name
      videos {
        thumbnail {
          url
        }
        videoId
        title
        duration
        publishedAt
      }
    }
  }
`

export function Head({ data }: HeadProps<DataProps>) {
  return <SEO title={data.youtubeContentGroup.name} />
}