"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  clients as allClients,
  type IClient,
  STATUS_COLORS,
  getClientWorstStatus,
} from "@/lib/data"

interface LeafletMapProps {
  clients: IClient[]
  selectedClientId: string | null
  onClientClick: (id: string) => void
}

function createPinIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 44 : 36
  const pulse = isSelected
    ? `<circle cx="22" cy="22" r="18" fill="${color}" opacity="0.2"><animate attributeName="r" from="14" to="22" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/></circle>`
    : ""
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 44 44">
      ${isSelected ? pulse : ""}
      <circle cx="22" cy="22" r="${isSelected ? 13 : 11}" fill="${color}" opacity="0.25"/>
      <circle cx="22" cy="22" r="${isSelected ? 9 : 7}" fill="${color}"/>
      <circle cx="22" cy="22" r="${isSelected ? 4 : 3}" fill="white"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export default function LeafletMap({ clients, selectedClientId, onClientClick }: LeafletMapProps) {
  return (
    <MapContainer
      center={[4.65, -74.08]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {clients.map(client => {
        if (!client.lat || !client.lng) return null
        const worstStatus = getClientWorstStatus(client.id)
        const color = STATUS_COLORS[worstStatus]
        const isSelected = selectedClientId === client.id
        const icon = createPinIcon(color, isSelected)
        return (
          <Marker
            key={client.id}
            position={[client.lat, client.lng]}
            icon={icon}
            eventHandlers={{ click: () => onClientClick(client.id) }}
          >
            <Popup>
              <strong>{client.name}</strong>
              <br />
              {client.address}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
