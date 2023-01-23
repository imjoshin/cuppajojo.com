import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Icon } from "../../../icon";
import * as styles from "./SocialButton.module.css"

interface SocialButtonProps {
  icon: string,
  name: string,
  href: string,
}

export const SocialButton = ({ icon, name, href }: SocialButtonProps) => {
  // Note: icons are mapped in another component, so we need to
  // ignore types here. The icon comes from graphql
  // @ts-ignore
  console.log(name)
  const iconComponent = <Icon i={icon} size={70} />

  return (
    <a href={href} target="_blank">
      <div className={styles.socialButton}>
        <div className={styles.socialIcon}>
          {iconComponent}
        </div>
        <div className={styles.socialName}>
          {name}
        </div>
      </div>
    </a>
  )
}