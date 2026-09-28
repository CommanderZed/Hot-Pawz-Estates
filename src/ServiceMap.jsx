import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ServiceMap() {
  const mapEl = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const center = [36.0798, -78.9565];
    const map = L.map(mapEl.current, {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView(center, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);

    const serviceRadius = L.circle(center, {
      radius: 16093.4,
      color: "#c45c2a",
      weight: 2,
      dashArray: "8 8",
      fillColor: "#d46932",
      fillOpacity: 0.16
    }).addTo(map);

    function fitServiceArea() {
      map.invalidateSize();
      map.fitBounds(serviceRadius.getBounds(), { padding: [20, 20], maxZoom: 10 });
    }

    mapRef.current = map;
    fitServiceArea();
    window.addEventListener("load", fitServiceArea);
    window.addEventListener("resize", fitServiceArea);
    const t1 = setTimeout(fitServiceArea, 300);

    return () => {
      clearTimeout(t1);
      window.removeEventListener("load", fitServiceArea);
      window.removeEventListener("resize", fitServiceArea);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapEl} className="h-[260px] w-full sm:h-[380px] md:h-[440px]" role="img" aria-label="Map of the 10-mile Durham County service area" />;
}
