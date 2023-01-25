import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { ContentBackground } from "../content-background";
import { Spaceship } from "../spaceship";
import * as styles from "./Home.module.css"
import { Socials } from "./socials";

interface HomeProps {
  hideSocials?: boolean,
  hideCenterpiece?: boolean,
}

export const Home = ({ hideSocials, hideCenterpiece }: HomeProps) => {
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

  const imageSources = images.allImageSharp.nodes.map(
    // @ts-ignore
    n => n.fixed.src
  )

  // TODO rotate somehow!
  const image = imageSources[0]

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