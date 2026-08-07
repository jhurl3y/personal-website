import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { LOCATIONS } from "../../utils/constants";
import type { SxProps, Theme } from "@mui/material/styles";
import type { MapsKey } from "../../utils/types";

type LatLng = { lat: number; lng: number };
type MapOptions = google.maps.MapOptions;

type MapComponentProps = {
  center: LatLng;
  zoom: number;
  options: MapOptions;
  showPolyline: boolean;
  polylineData: LatLng[];
  polylineOptions: google.maps.PolylineOptions;
};

type LoadedMapProps = MapComponentProps & { apiKey: string };

type MapContainerProps = {
  location: LatLng;
  zoom: number;
  mapStyles?: google.maps.MapTypeStyle[];
  title: string;
  showPolyline?: boolean;
  polylineData?: LatLng[];
  polylineOptions?: google.maps.PolylineOptions;
  mapSx?: SxProps<Theme>;
  apiKey: MapsKey;
};

const MapComponent = ({
  center,
  zoom,
  options,
  showPolyline,
  polylineData,
  polylineOptions,
}: MapComponentProps) => (
  <GoogleMap
    center={center}
    zoom={zoom}
    options={options}
    mapContainerStyle={{ height: "100%", width: "100%" }}
  >
    {showPolyline && <Polyline path={polylineData} options={polylineOptions} />}
  </GoogleMap>
);

// Bug 7.10: the Google loader lives in its own component so it is only mounted
// when an API key exists. `useJsApiLoader` is a hook and cannot be called
// conditionally, so guarding inside MapContainer would still have fired the
// request with an undefined key.
const LoadedMap = ({
  apiKey,
  center,
  zoom,
  options,
  showPolyline,
  polylineData,
  polylineOptions,
}: LoadedMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  if (!isLoaded) return null;

  return (
    <MapComponent
      center={center}
      zoom={zoom}
      options={options}
      showPolyline={showPolyline}
      polylineData={polylineData}
      polylineOptions={polylineOptions}
    />
  );
};

// Shown when GOOGLE_MAPS_API_KEY is absent. Makes no network request.
const MapFallback = () => (
  <ul>
    {LOCATIONS.map(({ name }) => (
      <li key={name} style={{ listStyle: "none", textTransform: "capitalize" }}>
        {name}
      </li>
    ))}
  </ul>
);

const MapContainer = ({
  location: { lng, lat },
  zoom,
  mapStyles = [],
  title,
  showPolyline = false,
  polylineData = [],
  polylineOptions = {},
  mapSx,
  apiKey,
}: MapContainerProps) => {
  const center = useMemo(() => ({ lng, lat }), [lng, lat]);
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      styles: mapStyles,
    }),
    [mapStyles]
  );

  return (
    <Box id={title} sx={mapSx}>
      {apiKey ? (
        <LoadedMap
          apiKey={apiKey}
          center={center}
          zoom={zoom}
          options={options}
          showPolyline={showPolyline}
          polylineData={polylineData}
          polylineOptions={polylineOptions}
        />
      ) : (
        <MapFallback />
      )}
    </Box>
  );
};

export default MapContainer;
