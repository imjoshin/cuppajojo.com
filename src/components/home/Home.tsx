import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { ContentBackground } from "../content-background";
import { Spaceship } from "../spaceship";
import * as styles from "./Home.module.css"
import { Socials } from "./socials";

export const Home = () => {
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

  console.log(imageSources)

  return (
    <div className={styles.home}>
      <ContentBackground />
      <Spaceship className={styles.homeImage} passenger={image} />
      <div className={styles.socials}>
        <Socials />
      </div>
    </div>
  )
}