import { graphql, useStaticQuery } from "gatsby";
import React, { useEffect, useRef, useState } from "react"
import { useRefSize } from "../../hooks/use-ref-size";
import * as styles from "./ContentBackground.module.css"
import { VideoFloater } from "./video-floater";

interface ContentBackgroundProps {
  layers?: number,
}

type VideoType = {
  id: string,
  image: string,
}

const VIDEO_SPAWN = 7000
const VIDEO_REMOVE = 30000

export const ContentBackground = ({ layers = 4 }: ContentBackgroundProps) => {
  const ref = useRef<HTMLDivElement>()
  const { width, height } = useRefSize(ref)
  const [videos, setVideos] = useState<{ [id: string]: { image: string, height: number } }>({})
  const videoRef = useRef(videos)
  videoRef.current = videos

  const videosQuery = useStaticQuery(
    graphql`
      query ContentBackgroundVideos {
        allYoutubeVideo {
          nodes {
            thumbnail {
              url
            }
            videoId
          }
        }
      }
    `
  )

  useEffect(() => {
    const videoObjects: VideoType[] = videosQuery.allYoutubeVideo.nodes.map(
      // @ts-ignore
      v => ({
        image: v.thumbnail.url,
        id: v.videoId
      })
    )

    const spawnVideo = () => {
      // get random video
      let chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
      while (videoRef.current[chosenVideo.id]) {
        chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
      }

      const newVideos = {
        [chosenVideo.id]: {
          image: chosenVideo.image,
          height: Math.floor(Math.random() * (90 - 10 + 1) + 10),
        },
        ...videoRef.current,
      }

      setVideos(newVideos)

      // remove the video
      setTimeout(() => {
        const newVideos = {
          ...videoRef.current,
        }

        delete newVideos[chosenVideo.id]

        setVideos(newVideos)
      }, VIDEO_REMOVE)
    }

    spawnVideo()
    const videoInterval = setInterval(spawnVideo, VIDEO_SPAWN)
    return () => {
      clearInterval(videoInterval)
    }
  }, [videosQuery])


  return (
    // @ts-ignore
    <div className={styles.contentBackground} ref={ref}>
      {Object.entries(videos).map(([id, { image, height }]) =>
        <VideoFloater key={id} id={id} image={image} height={height} />
      )}
    </div>
  )
}