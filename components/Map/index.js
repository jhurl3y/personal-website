import React, { useMemo } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { LOCATIONS } from "../../utils/constants";

const MapComponent = ({
  center,
  zoom,
  options,
  showPolyline,
  polylineData,
  polylineOptions,
}) => (
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
}) => {
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
  mapStyles = {},
  title,
  showPolyline = false,
  polylineData = [],
  polylineOptions = {},
  mapClasses,
  apiKey,
}) => {
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
    <div id={title} className={mapClasses}>
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
    </div>
  );
};

export default MapContainer;
