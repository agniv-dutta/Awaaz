import { TileLayer } from 'react-leaflet'
import { MAP_CONFIG } from '../../utils/mapConfig'

export const ReliableTileLayer = () => {
  return (
    <TileLayer
      url={MAP_CONFIG.PRIMARY_TILE}
      attribution={MAP_CONFIG.PRIMARY_ATTR}
      maxZoom={19}
      // If Stadia fails, browser falls back to cached tiles automatically
      errorTileUrl={`https://tile.openstreetmap.org/{z}/{x}/{y}.png`}
    />
  )
}
