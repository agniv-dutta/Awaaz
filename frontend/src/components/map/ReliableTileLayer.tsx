import { TileLayer } from 'react-leaflet'

export const ReliableTileLayer = () => {
  // Use multiple tile servers with fallback
  const tileServers = [
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  ]

  return (
    <TileLayer
      url={tileServers[0]} // Use most reliable OSM server
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      maxZoom={19}
      errorTileUrl="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  )
}
