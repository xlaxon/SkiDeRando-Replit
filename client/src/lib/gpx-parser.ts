export function parseGpx(gpxString: string): [number, number][] {
  try {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(gpxString, "text/xml");
    
    // Get all trackpoints
    const trackpoints = gpx.getElementsByTagName("trkpt");
    const coordinates: [number, number][] = [];

    for (let i = 0; i < trackpoints.length; i++) {
      const point = trackpoints[i];
      const lat = parseFloat(point.getAttribute("lat") || "0");
      const lon = parseFloat(point.getAttribute("lon") || "0");
      
      if (!isNaN(lat) && !isNaN(lon)) {
        coordinates.push([lat, lon]);
      }
    }

    return coordinates;
  } catch (error) {
    console.error("Error parsing GPX file:", error);
    return [];
  }
}
