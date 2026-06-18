import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapUpdater = ({ center }) => {
  const map = useMap();

  React.useEffect(() => {
    if (center) {
      map.setView(center, 11);
    }
  }, [center, map]);

  return null;
};

const Map = ({ location }) => {

  const styles = {
    locationContainer: {
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
    },
    coordinates: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: "10px 0",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      borderRadius: "6px",
      fontSize: "15px",
      color: "#333",
    },
    mapContainer: {
      marginTop: "20px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      height: "350px",
      width: "100%",
    },
    map: {
      height: "100%",
      width: "100%",
    },
  };

  return (
    <div style={styles.locationContainer}>
      {location && location.coordinates && (
        <div style={styles.mapContainer}>
          <MapContainer
            center={{lat: location.coordinates.latitude, lng: location.coordinates.longitude}}
            zoom={15} // Initial zoom level
            style={styles.map}
            scrollWheelZoom={true} // Allow users to zoom with mouse wheel
          >
            <MapUpdater center={{lat: location.coordinates.latitude, lng: location.coordinates.longitude}} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* <Marker position={{lat: location.coordinates.latitude, lng: location.coordinates.longitude}}>
              <Popup>
                <strong>Your Location</strong>
                <br />
                Lat: {location.coordinates.latitude.toFixed(4)}°<br />
                Lng: {location.coordinates.longitude.toFixed(4)}°
              </Popup>
            </Marker> */}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Map;
