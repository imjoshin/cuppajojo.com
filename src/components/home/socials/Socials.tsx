import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { useTwitchStatus } from "../../../hooks/use-twitch-status";
import { SocialButton } from "./social-button";
import * as styles from "./Socials.module.css"

export const Socials = () => {
  const twitchStatus = useTwitchStatus()

  // TODO handle these images better
  const socialsQuery = useStaticQuery(
    graphql`
      query Socials {
        allSocial {
          nodes {
            icon
            name
            redirect
          }
        }
      }
    `
  )

  const socials = socialsQuery.allSocial.nodes as { icon: string, name: string, redirect: string }[]

  return (
    <div className={styles.socials}>
      {socials.map(s => <SocialButton icon={s.icon} key={s.name} name={s.name} href={s.redirect} highlight={s.icon === "twitch" && twitchStatus.live} />)}
    </div>
  )
}