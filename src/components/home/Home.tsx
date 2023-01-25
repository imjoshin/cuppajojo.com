import { graphql, useStaticQuery } from "gatsby";
import React, { useState } from "react";
import { ContentBackground } from "../content-background";
import { Spaceship } from "../spaceship";
import * as styles from "./Home.module.css"
import { Socials } from "./socials";

interface HomeProps {
  hideSocials?: boolean,
  hideCenterpiece?: boolean,
  forcePassengerIndex?: number,
}

export const Home = ({ hideSocials, hideCenterpiece, forcePassengerIndex }: HomeProps) => {
  // TODO handle these images better
  const images = useStaticQuery(
    graphql`
      query HomeImage {
        allImageSharp(filter: {fields: {isHomeImage: {eq: true}}}) {
          nodes {
            fixed {
              src
            }
          }
        }
      }
    `
  )
  const [passengerIndex] = useState(Math.floor(Math.random() * images.allImageSharp.nodes.length))

  const imageSources = images.allImageSharp.nodes.map(
    // @ts-ignore
    n => n.fixed.src
  )

  // TODO rotate somehow!
  const image = imageSources[forcePassengerIndex !== undefined ? forcePassengerIndex : passengerIndex]

  return (
    <div className={styles.home}>
      <ContentBackground />
      {!hideCenterpiece && <Spaceship className={styles.homeImage} passenger={image} />}
      <div className={styles.socials}>
        {!hideSocials && <Socials />}
      </div>
    </div>
  )
}