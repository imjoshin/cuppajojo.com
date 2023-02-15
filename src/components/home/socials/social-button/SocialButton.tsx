import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Icon } from "../../../icon";
import * as styles from "./SocialButton.module.css"
import clsx from "clsx"

interface SocialButtonProps {
  icon: string,
  name: string,
  href: string,
  highlight: boolean,
}

export const SocialButton = ({ icon, name, href, highlight }: SocialButtonProps) => {
  // Note: icons are mapped in another component, so we need to
  // ignore types here. The icon comes from graphql
  // @ts-ignore
  const iconComponent = <Icon i={icon} size={70} />

  return (
    <a href={href} target={href.startsWith("/") ? undefined : "_blank"}>
      <div className={clsx(styles.socialButton, highlight && styles.socialButtonHighlight)}>
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