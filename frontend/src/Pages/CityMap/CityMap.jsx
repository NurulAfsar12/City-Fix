import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaLocationArrow } from "react-icons/fa";

const CityMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // Inject Leaflet CSS + JS from CDN at runtime
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function fixIcon() {
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }

    function initMap() {
      if (mapInstanceRef.current || !mapRef.current) return;
      fixIcon();

      const map = window.L.map(mapRef.current).setView([23.8103, 90.4125], 12);

      window.L
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Search a place via Nominatim and fly to it
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const results = await res.json();

      if (!results.length) {
        setError("No results found for your search.");
        return;
      }

      const { lat, lon, display_name } = results[0];
      const map = mapInstanceRef.current;
      const L = window.L;

      map.flyTo([parseFloat(lat), parseFloat(lon)], 15, { duration: 2 });

      if (markerRef.current) {
        markerRef.current.remove();
      }
      markerRef.current = L.marker([parseFloat(lat), parseFloat(lon)])
        .addTo(map)
        .bindPopup(display_name)
        .openPopup();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
    } finally {
      setSearching(false);
    }
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        const L = window.L;

        map.flyTo([latitude, longitude], 15, { duration: 2 });

        if (markerRef.current) {
          markerRef.current.remove();
        }
        markerRef.current = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary uppercase">City Map</h2>
        <p className="text-base-content/70 mt-2">
          Explore your city and locate reported issues
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 justify-center mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search any place in your city..."
            className="input input-bordered w-full pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button type="submit" disabled={searching} className="btn btn-primary text-white">
          {searching ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Search"
          )}
        </button>

        <button
          type="button"
          onClick={locateMe}
          className="btn btn-outline gap-2"
        >
          <FaLocationArrow /> My Location
        </button>
      </form>

      {error && (
        <div className="alert alert-warning max-w-xl mx-auto mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[500px] md:h-[600px] rounded-2xl shadow-lg z-0"
      />
    </div>
  );
};

export default CityMap;
