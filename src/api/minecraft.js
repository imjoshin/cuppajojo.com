const MINECRAFT_ADDRESS = "mc.cuppajojo.com"

export default async function handler(req, res) {
  const url = `https://api.mcsrvstat.us/2/${MINECRAFT_ADDRESS}`

  const r = await fetch(url).then(r => r.json())

  let response = {
    online: false,
    address: MINECRAFT_ADDRESS,
  }

  if (r.online) {
    let players = []
    if (r.players.online > 0) {
      players = r.players.list.map(player => ({
        name: player,
        avatar: `https://minotar.net/helm/${player}/64.png`,
      }))
    }

    response = {
      online: true,
      address: MINECRAFT_ADDRESS,
      motd: r.motd.html[0],
      icon: r.icon,
      version: r.version,
      players,
      maxPlayers: r.players.max,
    }
  }

  res.status(200).json(response)
}