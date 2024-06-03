import React, { useMemo } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  return (
    <div id={title} className={mapClasses}>
      {isLoaded && (
        <MapComponent
          center={center}
          zoom={zoom}
          options={options}
          showPolyline={showPolyline}
          polylineData={polylineData}
          polylineOptions={polylineOptions}
        />
      )}
    </div>
  );
};

export default MapContainer;
