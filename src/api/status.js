import TwitchApi from "node-twitch";

const TWITCH_NAME = "CuppaJoJo_"
const THUMBNAIL_DIMENSIONS = {
  width: 1920 / 4,
  height: 1080 / 4,
}

export default async function handler(req, res) {
  const twitch = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET
  });

  const streams = await twitch.getStreams({ channel: TWITCH_NAME });

  let response = { live: false }

  if (streams && streams.data && streams.data.length) {
    const channel = streams.data[0]

    response = {
      live: true,
      game: channel.game_name,
      title: channel.title,
      viewers: channel.viewer_count,
      started: channel.started_at,
      thumbnail: channel.getThumbnailUrl(THUMBNAIL_DIMENSIONS),
    }
  }

  res.status(200).json(response)
}