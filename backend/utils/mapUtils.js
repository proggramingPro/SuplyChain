// // utils/mapUtils.js - Free Map API utilities
// const fetch = require('node-fetch');

// class FreeMapService {
//   constructor() {
//     this.openRouteServiceKey = process.env.OPENROUTESERVICE_API_KEY;
//     this.mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
//     this.nominatimUserAgent = process.env.NOMINATIM_USER_AGENT || 'Supply-Chain-App/1.0';
//     this.nominatimEmail = process.env.NOMINATIM_EMAIL;
//     this.osrmServer = process.env.OSRM_SERVER_URL || 'http://router.project-osrm.org';
//   }

//   // Method 1: Use OSRM (completely free, no API key needed)
//   async getRouteOSRM(coordinates) {
//     try {
//       const coordString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
//       const url = `${this.osrmServer}/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=true`;
      
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.code !== 'Ok') {
//         throw new Error(`OSRM Error: ${data.message}`);
//       }
      
//       const route = data.routes[0];
//       return {
//         distance: Math.round(route.distance / 1000), // km
//         duration: Math.round(route.duration / 60), // minutes
//         geometry: route.geometry,
//         steps: this.extractSteps(route.legs),
//         provider: 'OSRM'
//       };
//     } catch (error) {
//       console.error('OSRM routing error:', error);
//       throw error;
//     }
//   }

//   // Method 2: Use OpenRouteService (free tier: 2000 requests/day)
//   async getRouteOpenRouteService(coordinates) {
//     if (!this.openRouteServiceKey) {
//       throw new Error('OpenRouteService API key not configured');
//     }

//     try {
//       const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': this.openRouteServiceKey,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           coordinates: coordinates,
//           radiuses: Array(coordinates.length).fill(1000), // 1km radius for each point
//           instructions: true
//         })
//       });
      
//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(`OpenRouteService Error: ${data.error.message}`);
//       }
      
//       const route = data.features[0];
//       const properties = route.properties;
      
//       return {
//         distance: Math.round(properties.segments[0].distance / 1000), // km
//         duration: Math.round(properties.segments[0].duration / 60), // minutes
//         geometry: route.geometry,
//         steps: properties.segments[0].steps,
//         provider: 'OpenRouteService'
//       };
//     } catch (error) {
//       console.error('OpenRouteService routing error:', error);
//       throw error;
//     }
//   }

//   // Method 3: Use MapBox (free tier: 50,000 requests/month)
//   async getRouteMapbox(coordinates) {
//     if (!this.mapboxToken) {
//       throw new Error('Mapbox access token not configured');
//     }

//     try {
//       const coordString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
//       const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?access_token=${this.mapboxToken}&overview=full&geometries=geojson&steps=true`;
      
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.code !== 'Ok') {
//         throw new Error(`Mapbox Error: ${data.message}`);
//       }
      
//       const route = data.routes[0];
//       return {
//         distance: Math.round(route.distance / 1000), // km
//         duration: Math.round(route.duration / 60), // minutes
//         geometry: route.geometry,
//         steps: route.legs[0].steps,
//         provider: 'Mapbox'
//       };
//     } catch (error) {
//       console.error('Mapbox routing error:', error);
//       throw error;
//     }
//   }

//   // Unified routing method with fallback
//   async getRoute(coordinates) {
//     const providers = [
//       () => this.getRouteOSRM(coordinates),
//       () => this.getRouteOpenRouteService(coordinates),
//       () => this.getRouteMapbox(coordinates)
//     ];

//     for (const provider of providers) {
//       try {
//         return await provider();
//       } catch (error) {
//         console.warn('Provider failed, trying next:', error.message);
//         continue;
//       }
//     }

//     throw new Error('All routing providers failed');
//   }

//   // Geocoding with Nominatim (free)
//   async geocode(address) {
//     try {
//       const encodedAddress = encodeURIComponent(address);
//       const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&addressdetails=1`;
      
//       const response = await fetch(url, {
//         headers: {
//           'User-Agent': this.nominatimUserAgent,
//           'Referer': this.nominatimEmail || 'localhost'
//         }
//       });
      
//       const data = await response.json();
      
//       return data.map(result => ({
//         displayName: result.display_name,
//         latitude: parseFloat(result.lat),
//         longitude: parseFloat(result.lon),
//         boundingBox: result.boundingbox?.map(coord => parseFloat(coord)),
//         type: result.type,
//         importance: result.importance,
//         address: result.address
//       }));
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       throw new Error('Failed to geocode address');
//     }
//   }

//   // Reverse geocoding
//   async reverseGeocode(lat, lng) {
//     try {
//       const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      
//       const response = await fetch(url, {
//         headers: {
//           'User-Agent': this.nominatimUserAgent,
//           'Referer': this.nominatimEmail || 'localhost'
//         }
//       });
      
//       const data = await response.json();
      
//       return {
//         displayName: data.display_name,
//         address: data.address,
//         latitude: parseFloat(data.lat),
//         longitude: parseFloat(data.lon)
//       };
//     } catch (error) {
//       console.error('Reverse geocoding error:', error);
//       throw new Error('Failed to reverse geocode coordinates');
//     }
//   }

//   // Get map tiles info for frontend (using free tile servers)
//   getMapTileConfig() {
//     return {
//       openStreetMap: {
//         url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//         attribution: '© OpenStreetMap contributors',
//         maxZoom: 19
//       },
//       cartoDB: {
//         url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
//         attribution: '© OpenStreetMap contributors © CARTO',
//         maxZoom: 20
//       },
//       stamen: {
//         url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
//         attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors',
//         maxZoom: 18
//       }
//     };
//   }

//   // Calculate distance between two points (Haversine formula)
//   calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//               Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   }

//   // Extract steps from route legs
//   extractSteps(legs) {
//     const steps = [];
//     legs.forEach(leg => {
//       if (leg.steps) {
//         leg.steps.forEach(step => {
//           steps.push({
//             instruction: step.maneuver?.instruction || step.name,
//             distance: step.distance,
//             duration: step.duration,
//             geometry: step.geometry
//           });
//         });
//       }
//     });
//     return steps;
//   }

//   // Get elevation data (using free API)
//   async getElevation(coordinates) {
//     try {
//       // Using open-elevation.com (free)
//       const locations = coordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] }));
      
//       const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ locations: locations.slice(0, 10) }) // Limit to 10 points
//       });
      
//       const data = await response.json();
//       return data.results;
//     } catch (error) {
//       console.error('Elevation API error:', error);
//       return [];
//     }
//   }

//   // Check if point is within a geographic boundary
//   isPointInBounds(lat, lng, bounds) {
//     return lat >= bounds.south && 
//            lat <= bounds.north && 
//            lng >= bounds.west && 
//            lng <= bounds.east;
//   }

//   // Create geofence around a point
//   createGeofence(centerLat, centerLng, radiusKm) {
//     const latOffset = radiusKm / 111.32; // Approximate km to degree conversion
//     const lngOffset = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
    
//     return {
//       center: { latitude: centerLat, longitude: centerLng },
//       radius: radiusKm,
//       bounds: {
//         north: centerLat + latOffset,
//         south: centerLat - latOffset,
//         east: centerLng + lngOffset,
//         west: centerLng - lngOffset
//       }
//     };
//   }
// }

// module.exports = new FreeMapService();