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
  const [floaters, setFloaters] = useState<{ [id: string]: { image: string, height: number, type: string } }>({})
  const floatersRef = useRef(floaters)
  floatersRef.current = floaters

  const floatersQuery = useStaticQuery(
    graphql`
      query ContentBackgroundFloaters {
        allYoutubeVideo {
          nodes {
            thumbnail {
              url
            }
            videoId
          }
        }
        allYoutubeContentGroup {
          nodes {
            id
            icon
          }
        }
      }
    `
  )

  useEffect(() => {
    const videoObjects: VideoType[] = floatersQuery.allYoutubeVideo.nodes.map(
      // @ts-ignore
      v => ({
        image: v.thumbnail.url,
        id: v.videoId
      })
    )
    const groupObjects: VideoType[] = floatersQuery.allYoutubeContentGroup.nodes.map(
      // @ts-ignore
      g => ({
        image: g.icon,
        id: g.id,
      })
    )

    const spawnVideo = () => {
      let newVideoId: string
      let newFloaters = {}

      // 1 in 5 chance of spawning a group
      if (Math.floor(Math.random() * 5) === 0) {
        // get random group
        let chosenGroup = groupObjects[Math.floor(Math.random() * groupObjects.length)]

        if (groupObjects.length >= 5) {
          while (floatersRef.current[chosenGroup.id]) {
            chosenGroup = groupObjects[Math.floor(Math.random() * groupObjects.length)]
          }
        }

        newVideoId = chosenGroup.id

        newFloaters = {
          [chosenGroup.id]: {
            image: `/images/${chosenGroup.image}.png`,
            height: Math.floor(Math.random() * (90 - 10 + 1) + 10),
            type: "group",
          },
          ...floatersRef.current,
        }
      } else {
        // get random video
        let chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
        while (floatersRef.current[chosenVideo.id]) {
          chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
        }

        newVideoId = chosenVideo.id

        newFloaters = {
          [chosenVideo.id]: {
            image: chosenVideo.image,
            height: Math.floor(Math.random() * (90 - 10 + 1) + 10),
            type: "video",
          },
          ...floatersRef.current,
        }
      }


      setFloaters(newFloaters)

      // remove the video
      setTimeout(() => {
        const newVideos = {
          ...floatersRef.current,
        }

        delete newVideos[newVideoId]

        setFloaters(newVideos)
      }, VIDEO_REMOVE)
    }

    spawnVideo()
    const videoInterval = setInterval(spawnVideo, VIDEO_SPAWN)
    return () => {
      clearInterval(videoInterval)
    }
  }, [floatersQuery])


  return (
    // @ts-ignore
    <div className={styles.contentBackground} ref={ref}>
      {Object.entries(floaters).map(([id, { image, height, type }]) =>
        <VideoFloater key={id} id={id} image={image} height={height} type={type} />
      )}
    </div>
  )
}