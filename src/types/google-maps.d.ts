declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    getBounds(): LatLngBounds | undefined;
    addListener(eventName: string, handler: Function): MapsEventListener;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
  }

  class Marker {
    constructor(opts: MarkerOptions);
  }

  interface MarkerOptions {
    map: Map;
    position: LatLng | LatLngLiteral;
    title?: string;
  }

  class MapsEventListener {
    remove(): void;
  }

  namespace places {
    class SearchBox {
      constructor(inputField: HTMLInputElement);
      setBounds(bounds: LatLngBounds): void;
      getPlaces(): PlaceResult[];
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    interface PlaceResult {
      geometry?: {
        location?: LatLng;
      };
      name?: string;
    }
  }
} 