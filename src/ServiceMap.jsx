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
      dragging: false,
      tap: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomControl: false
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
      fillOpacity: 0.16,
      interactive: false
    }).addTo(map);

    function fitServiceArea() {
      map.invalidateSize();
      map.setMinZoom(1);
      map.setMaxZoom(10);
      map.fitBounds(serviceRadius.getBounds(), { padding: [20, 20], maxZoom: 10 });
      const lockedZoom = map.getZoom();
      map.setMinZoom(lockedZoom);
      map.setMaxZoom(lockedZoom);
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

  return <div ref={mapEl} className="h-[200px] w-full sm:h-[280px] md:h-[320px]" role="img" aria-label="Map of the 10-mile Durham County service area" />;
}
