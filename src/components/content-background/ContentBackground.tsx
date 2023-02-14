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
            publishedAt
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
    const weightedVideoObjects: VideoType[] = []
    // sort newest to oldest
    const sortedVideos = floatersQuery.allYoutubeVideo.nodes.sort((a: any, b: any) => {
      return new Date(a.publishedAt) < new Date(b.publishedAt) ? 1 : -1
    })

    // use a log curve to get the video weight
    //   this means the first video will have a weight of 100 + 10
    //   the last video will have a weight of 0 + 10
    //   and a log curve in between, so newer videos will appear more frequently
    //     https://www.desmos.com/calculator/lz631kek0g
    // 
    // the commented out function is also an option that uses a reverse
    //   exponential, but I like the idea of the most recent video showing
    //   way more often than, for example, the 5th video
    const getVideoWeight = (videoNumber: number) => {
      return Math.ceil(110 - (Math.log(videoNumber + 1) / Math.log(sortedVideos.length) * 100))
      // return Math.ceil(100 + -1 * Math.pow(videoNumber / (sortedVideos.length / 10), 2)) + 10
    }

    for (let i = 0; i < sortedVideos.length; i++) {
      const video = sortedVideos[i]
      const weight = getVideoWeight(i)
      console.log({
        i,
        weight
      })

      const videoObject = {
        image: video.thumbnail.url,
        id: video.videoId
      }

      // add a copy of the video object for each weight for later randomness
      for (let j = 0; j < weight; j++) {
        weightedVideoObjects.push(videoObject)
      }
    }

    const groupObjects: VideoType[] = floatersQuery.allYoutubeContentGroup.nodes.map(
      // @ts-ignore
      g => ({
        image: g.icon,
        id: g.id,
      })
    )

    const spawnVideo = () => {
      // get random video
      let chosenVideo = weightedVideoObjects[Math.floor(Math.random() * weightedVideoObjects.length)]
      while (floatersRef.current[chosenVideo.id]) {
        chosenVideo = weightedVideoObjects[Math.floor(Math.random() * weightedVideoObjects.length)]
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

    let videoInterval: ReturnType<typeof setInterval> | undefined = undefined;
    if (sortedVideos.length) {
      spawnVideo()
      videoInterval = setInterval(spawnVideo, VIDEO_SPAWN)
    }

    let groupInterval: ReturnType<typeof setInterval> | undefined = undefined;
    if (groupObjects.length) {
      spawnGroup()
      groupInterval = setInterval(spawnGroup, GROUP_SPAWN)
    }

    return () => {
      if (videoInterval) {
        clearInterval(videoInterval)
      }

      if (groupInterval) {
        clearInterval(groupInterval)
      }
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
