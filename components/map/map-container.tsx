"use client"

import { useEffect } from "react"
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Employee } from "@/lib/data"

// Fix Leaflet marker icon issue in Next.js
const fixLeafletIcons = () => {
  // Only run on client
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }
}

// Custom marker icons
const createMarkerIcon = (isActive: boolean) => {
  return new L.Icon({
    iconUrl: isActive
      ? "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    iconRetinaUrl: isActive
      ? "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

interface MapContainerProps {
  markers: (Employee & { lat: number; lng: number; isActive: boolean })[]
}

export function MapContainer({ markers }: MapContainerProps) {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  // Calculate map bounds to fit all markers
  const bounds =
    markers.length > 0 ? markers.map((marker) => [marker.lat, marker.lng] as [number, number]) : [[37, -95]] // Default center on US if no markers

  return (
    <div className="h-[500px] w-full rounded-md overflow-hidden border">
      <LeafletMapContainer
        center={[37, -95]} // Default center on US
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        bounds={bounds.length > 1 ? bounds : undefined}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={createMarkerIcon(marker.isActive)}>
            <Popup>
              <div className="p-1">
                <h3 className="font-medium">{marker.name}</h3>
                <p className="text-xs">{marker.email}</p>
                <p className="text-xs mt-1">
                  {marker.department} • {marker.position}
                </p>
                <p className="text-xs mt-1 font-medium">Status: {marker.isActive ? "Active" : "Inactive"}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </div>
  )
}

