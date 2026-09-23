"use client";

import L from "leaflet";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { categories, statuses, type Report } from "@/lib/model";

const JERUSALEM_CENTER: [number, number] = [31.7683, 35.2137];
const validPoint = (report: Report) => Number.isFinite(report.latitude) && Number.isFinite(report.longitude) && Math.abs(report.latitude) <= 90 && Math.abs(report.longitude) <= 180;

const reportIcon = L.divIcon({
  className: "report-marker",
  html: "<span></span>",
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function MapClient({ reports, small }: { reports: Report[]; small: boolean }) {
  const router = useRouter();
  const points = reports.filter(validPoint);
  const center: [number, number] = small && points[0]
    ? [points[0].latitude, points[0].longitude]
    : JERUSALEM_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={small ? 15 : 12}
      className="leaflet-container"
      zoomControl={!small}
      dragging={!small}
      scrollWheelZoom={!small}
      doubleClickZoom={!small}
      attributionControl={!small}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={reportIcon}
          title={`${report.ticketNumber} · ${categories[report.category]} · ${statuses[report.status]}`}
          eventHandlers={{ click: () => router.push(`/reports/${report.id}`) }}
        />
      ))}
    </MapContainer>
  );
}
