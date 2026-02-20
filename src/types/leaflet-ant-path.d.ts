declare module "leaflet-ant-path" {
  import * as L from "leaflet";

  export function antPath(
    latlngs: L.LatLngExpression[] | L.LatLngExpression[][],
    options?: any
  ): L.Polyline;

  const antPathDefault: typeof antPath;
  export default antPathDefault;
}
