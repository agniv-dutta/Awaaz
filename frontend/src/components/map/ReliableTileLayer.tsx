import { useState, useEffect } from 'react'
import { TileLayer } from 'react-leaflet'
import { MAP_CONFIG } from '../../utils/mapConfig'

export const ReliableTileLayer = () => {
  const [tileUrl, setTileUrl] = useState(MAP_CONFIG.PRIMARY_TILE)
  const [attribution, setAttribution] = useState(MAP_CONFIG.PRIMARY_ATTR)

  useEffect(() => {
    // Test if primary tile server is accessible
    const img = new Image()
    img.onload = () => {
      // Primary works, keep using it
      setTileUrl(MAP_CONFIG.PRIMARY_TILE)
      setAttribution(MAP_CONFIG.PRIMARY_ATTR)
    }
    img.onerror = () => {
      // Primary failed, switch to fallback
      console.log('🗺️ Primary tile server failed, switching to OSM fallback')
      setTileUrl(MAP_CONFIG.FALLBACK_TILE)
      setAttribution(MAP_CONFIG.FALLBACK_ATTR)
    }
    img.src = MAP_CONFIG.PRIMARY_TILE.replace('{z}', '10').replace('{x}', '512').replace('{y}', '384')
  }, [])

  return (
    <TileLayer
      url={tileUrl}
      attribution={attribution}
      maxZoom={19}
    />
  )
}
