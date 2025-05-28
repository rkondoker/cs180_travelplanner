"use client";

import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Define the type for our markers
type MapMarker = {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  selected: boolean; // Add this to track selection
  details?: {
    name?: string;
    address?: string;
    phone?: string;
  };
};

export default function ExplorePage() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null,
  );
  const [watchId, setWatchId] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [locationCircle, setLocationCircle] =
    useState<google.maps.Circle | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
    setDirectionsService(new google.maps.DirectionsService());
    setCenter({
      lat: map.getCenter()?.lat() || 0,
      lng: map.getCenter()?.lng() || 0,
    });
  };

  const onUnmount = () => {
    setMap(null);
  };

  // Handle map click to add a new marker
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng && map) {
      const service = new google.maps.places.PlacesService(map);

      service.findPlaceFromQuery(
        {
          query: "restaurant", // or any other place type
          fields: ["name", "geometry"],
          locationBias: {
            center: event.latLng,
            radius: 50,
          },
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results &&
            event.latLng
          ) {
            const newMarker: MapMarker = {
              id: Date.now(),
              position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              },
              name: results[0]?.name || "Unknown Location",
              selected: false,
            };
            setMarkers([...markers, newMarker]);
          }
        },
      );
    }
  };

  const toggleMarkerSelection = (markerId: number) => {
    setMarkers(
      markers.map((marker) =>
        marker.id === markerId
          ? { ...marker, selected: !marker.selected }
          : marker,
      ),
    );
  };

  const calculateRoute = () => {
    if (!directionsService || markers.filter((m) => m.selected).length < 2)
      return;

    const selectedMarkers = markers.filter((m) => m.selected);
    const origin = selectedMarkers[0].position;
    const destination = selectedMarkers[selectedMarkers.length - 1].position;
    const waypoints = selectedMarkers.slice(1, -1).map((marker) => ({
      location: marker.position,
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const route = result.routes[0];
          setRouteInfo({
            distance: route.legs.reduce(
              (acc, leg) => acc + leg.distance?.text,
              "",
            ),
            duration: route.legs.reduce(
              (acc, leg) => acc + leg.duration?.text,
              "",
            ),
          });
        }
      },
    );
  };

  const resetMap = () => {
    setMarkers([]);
    setDirections(null);
    setRouteInfo(null);
    if (locationCircle) {
      locationCircle.setMap(null);
      setLocationCircle(null);
    }
  };

  // Add this function after the other functions
  const handleMarkerLoad = (marker: google.maps.Marker) => {
    // Start with DROP animation
    marker.setAnimation(google.maps.Animation.DROP);

    // After 1 second, switch to BOUNCE
    setTimeout(() => {
      marker.setAnimation(google.maps.Animation.BOUNCE);

      // After 2 more seconds, stop the animation
      setTimeout(() => {
        marker.setAnimation(null);
      }, 2000);
    }, 1000);
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(new google.maps.LatLng(pos.lat, pos.lng));

          // Center and zoom the map
          map?.panTo(pos);
          map?.setZoom(13); // This zoom level roughly shows 1 mile radius

          // Create or update the circle
          if (locationCircle) {
            locationCircle.setCenter(pos);
          } else {
            const circle = new google.maps.Circle({
              strokeColor: "#4285F4",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#4285F4",
              fillOpacity: 0.1,
              map,
              center: pos,
              radius: 1609.34, // 1 mile in meters
            });
            setLocationCircle(circle);
          }

          // Start watching position
          const id = navigator.geolocation.watchPosition(
            (position) => {
              const newPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(new google.maps.LatLng(newPos.lat, newPos.lng));
              map?.panTo(newPos);
              locationCircle?.setCenter(newPos);
            },
            (error) => {
              console.error("Error watching location:", error);
            },
          );
          setWatchId(id);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    toggleMarkerSelection(marker.id);
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="w-full h-screen relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {/* Add user location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
            />
          )}
          {/* Render all markers */}
          {markers.map((marker) => (
            <React.Fragment key={marker.id}>
              <Marker
                position={marker.position}
                onLoad={handleMarkerLoad}
                onClick={() => handleMarkerClick(marker)}
                icon={{
                  url: marker.selected
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
              {selectedMarker?.id === marker.id && (
                <InfoWindow
                  position={marker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-lg">
                      {marker.details?.name || "Unnamed Location"}
                    </h3>
                    {marker.details?.address && (
                      <p className="text-sm text-gray-600">
                        {marker.details.address}
                      </p>
                    )}
                    {marker.details?.phone && (
                      <p className="text-sm text-gray-600">
                        {marker.details.phone}
                      </p>
                    )}
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedMarker(null);
                          setMarkers(markers.filter((m) => m.id !== marker.id));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {/* Marker List Panel */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Places ({markers.length})</h2>
        <button
          onClick={calculateRoute}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
          disabled={markers.filter((m) => m.selected).length < 2}
        >
          Calculate Route
        </button>
        {routeInfo && (
          <div className="bg-blue-50 p-3 rounded mb-4">
            <p className="text-sm font-medium text-blue-800">
              Total Distance: {routeInfo.distance}
            </p>
            <p className="text-sm font-medium text-blue-800">
              Estimated Time: {routeInfo.duration}
            </p>
          </div>
        )}
        <div className="space-y-2">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                marker.selected ? "bg-green-100" : "hover:bg-gray-100"
              }`}
              onClick={() => toggleMarkerSelection(marker.id)}
            >
              <span className="font-medium">{marker.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMarkers(markers.filter((m) => m.id !== marker.id));
                }}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add My Location button next to Reset Map button */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={handleMyLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 z-10"
        >
          My Location
        </button>
        <button
          onClick={resetMap}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 z-10"
        >
          Reset Map
        </button>
      </div>
    </div>
  );
}
