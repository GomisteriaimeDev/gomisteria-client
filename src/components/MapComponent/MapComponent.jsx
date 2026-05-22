import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const SearchControl = ({ onLocationSelected }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      keepResult: true,
      autoClose: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { location } = result;
      onLocationSelected({ lat: location.y, lng: location.x });
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelected]);

  return null;
};

const LocateControl = ({ onLocated }) => {
  const map = useMap();

  useEffect(() => {
    const locateControl = L.Control.extend({
      options: { position: "topleft" },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const button = L.DomUtil.create("a", "", container);
        button.href = "#";
        button.title = "Use my location";
        button.innerHTML = "📍";
        button.style.cssText =
          "display:flex;align-items:center;justify-content:center;width:34px;height:34px;font-size:18px;cursor:pointer;background:#fff;";

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.on(button, "click", (e) => {
          L.DomEvent.preventDefault(e);
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              map.flyTo([latitude, longitude], 16);
              onLocated({ lat: latitude, lng: longitude });
            },
            () => {},
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });

        return container;
      },
    });

    const control = new locateControl();
    map.addControl(control);
    return () => map.removeControl(control);
  }, [map, onLocated]);

  return null;
};

const GpsInitializer = ({ onLocated }) => {
  const map = useMap();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !navigator.geolocation) return;
    hasRun.current = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 16);
        onLocated({ lat: latitude, lng: longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map, onLocated]);

  return null;
};

const MapComponent = ({ onLocationSelected }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleLocationUpdate = (pos) => {
    setMarkerPosition([pos.lat, pos.lng]);
    onLocationSelected(pos);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleLocationUpdate({ lat, lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[42.6629, 21.1655]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SearchControl onLocationSelected={handleLocationUpdate} />
      <GpsInitializer onLocated={handleLocationUpdate} />
      <LocateControl onLocated={handleLocationUpdate} />
      <MapClickHandler />
      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
};

export default MapComponent;
