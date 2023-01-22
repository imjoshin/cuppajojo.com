const React = require("react")
const { LiveWrapper } = require("./src/components/live-wrapper")

exports.wrapPageElement = ({ element, props }) => {
  return (
    <LiveWrapper>
      {element}
    </LiveWrapper>
  )
}