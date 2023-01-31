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
const GROUP_SPAWN = 9500
const FLOATER_REMOVE = 30000

const MAX_ATTEMPTS_TO_SPAWN_NEW_FLOATER = 5

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
      // get random video
      let chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
      while (floatersRef.current[chosenVideo.id]) {
        chosenVideo = videoObjects[Math.floor(Math.random() * videoObjects.length)]
      }

      const newFloaters = {
        [chosenVideo.id]: {
          image: chosenVideo.image,
          height: Math.floor(Math.random() * (90 - 10 + 1) + 10),
          type: "video",
        },
        ...floatersRef.current,
      }


      setFloaters(newFloaters)

      // remove the video
      setTimeout(() => {
        const newFloaters = {
          ...floatersRef.current,
        }

        delete newFloaters[chosenVideo.id]

        setFloaters(newFloaters)
      }, FLOATER_REMOVE)
    }

    const spawnGroup = () => {
      // get random group
      let chosenGroup = groupObjects[Math.floor(Math.random() * groupObjects.length)]

      let attempts = 0
      while (floatersRef.current[chosenGroup.id] && attempts < MAX_ATTEMPTS_TO_SPAWN_NEW_FLOATER) {
        chosenGroup = groupObjects[Math.floor(Math.random() * groupObjects.length)]
        attempts++
      }

      if (attempts >= MAX_ATTEMPTS_TO_SPAWN_NEW_FLOATER) {
        return
      }

      const newFloaters = {
        [chosenGroup.id]: {
          image: `/images/${chosenGroup.image}.png`,
          height: Math.floor(Math.random() * (90 - 10 + 1) + 10),
          type: "group",
        },
        ...floatersRef.current,
      }


      setFloaters(newFloaters)

      // remove the group
      setTimeout(() => {
        const newFloaters = {
          ...floatersRef.current,
        }

        delete newFloaters[chosenGroup.id]

        setFloaters(newFloaters)
      }, FLOATER_REMOVE)
    }

    spawnVideo()
    spawnGroup()

    const videoInterval = setInterval(spawnVideo, VIDEO_SPAWN)
    const groupInterval = setInterval(spawnGroup, GROUP_SPAWN)

    return () => {
      clearInterval(videoInterval)
      clearInterval(groupInterval)
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
