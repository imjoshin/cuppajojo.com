import redirects from "./redirects.json"

exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions;

  redirects.forEach(redirect =>
    createRedirect({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
    })
  )
}