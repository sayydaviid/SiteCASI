// src/pages/Home/location/Location.jsx

import React, { useState, useEffect } from 'react'
import L from 'leaflet'
import { TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Estilos para o componente do mapa (pergaminho)
import { Wrapper, StyledMap, BorderOverlay } from './Location.styles'
import mapBorder from '../../../assets/images/bordas.png'

// Estilos para a seção de duas colunas (layout)
// Certifique-se que o caminho para este arquivo está correto
import {
  LocationSectionContainer,
  LocationContent,
  TextColumn,
  MapColumn
} from './Location.styles'


// --- LÓGICA DO MAPA ---

// Cantos SW / NE reais do pergaminho
const southWest = [-1.465123, -48.492345]
const northEast = [-1.450678, -48.470123]

// “X” em 1°28′39″S  48°27′25″W
const centerAcad = {
  lat:  -(1  + 28/60 + 39/3600),   // ≈ -1.4775
  lng: -(48 + 27/60 + 25/3600)    // ≈ -48.4569
}

// Marcador do jogador que cresce conforme aproximação
function PlayerMarker({ target }) {
  const [pos, setPos]   = useState(null)
  const [dist, setDist] = useState(Infinity)
  const map = useMapEvents({})

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const ll = L.latLng(coords.latitude, coords.longitude)
        setPos(ll)

        // Haversine
        const R = 6371
        const dLat = (target.lat - ll.lat) * Math.PI/180
        const dLng = (target.lng - ll.lng) * Math.PI/180
        const a = Math.sin(dLat/2)**2
                  + Math.cos(ll.lat * Math.PI/180)
                  * Math.cos(target.lat * Math.PI/180)
                  * Math.sin(dLng/2)**2
        const d = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        setDist(d)
      },
      console.error,
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [target, map])

  if (!pos) return null

  const size = Math.max(16, 64 * (1 - Math.min(dist, 1)))
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: rgba(255,255,255,0.8);
      border: 2px solid #000;
      border-radius: 50%;
    "></div>`,
    iconSize:   [size, size],
    iconAnchor: [size/2, size/2],
  })

  return <Marker position={pos} icon={icon} />
}


// --- COMPONENTES ---

// 1. Componente interno que renderiza apenas o mapa interativo
function InteractiveMap() {
  const center = [centerAcad.lat, centerAcad.lng]

  return (
    <Wrapper>
      <StyledMap
        center={center}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[centerAcad.lat, centerAcad.lng]}
          icon={L.divIcon({
            className: '',
            html: `<span style="
              color: red;
              font-size: 32px;
              line-height: 1;
              display: inline-block;
            ">X</span>`,
            iconSize:   [32, 32],
            iconAnchor: [16, 32]
          })}
        />

        <PlayerMarker target={centerAcad} />
      </StyledMap>

      <BorderOverlay src={mapBorder} alt="Borda estilo Minecraft" />
    </Wrapper>
  )
}

// 2. Componente principal que agora renderiza a seção inteira
export default function Location() {
  return (
    <LocationSectionContainer id="localizacao">
      <LocationContent id = "localizacao">
        <TextColumn>
          <h2>Localização</h2>
          <p>
            O "X" marca o local do nosso tesouro! Nosso Centro Acadêmico está localizado no coração da UFPA. Use o mapa interativo para encontrar sua localização em tempo real e ver a que distância você está.
          </p>
          <p>
            As coordenadas apontam para o bloco A do campus básico da UFPA. Esperamos por você!
          </p>
        </TextColumn>
        <MapColumn>
          {/* O mapa interativo é inserido aqui */}
          <InteractiveMap />
        </MapColumn>
      </LocationContent>
    </LocationSectionContainer>
  )
}