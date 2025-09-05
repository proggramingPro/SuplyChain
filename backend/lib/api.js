// lib/api.js - Complete API client for Next.js frontend
import io from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

class SupplyChainAPI {
  constructor() {
    this.socket = null;
  }

  // Initialize WebSocket connection for real-time updates
  initializeWebSocket() {
    if (!this.socket) {
      this.socket = io(WS_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to backend WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from backend WebSocket');
      });
    }
    return this.socket;
  }

  // Driver-specific methods for your dashboard
  static async getDriverCurrentShipment(driverId) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/current-shipment`);
      if (!response.ok) throw new Error('Failed to fetch current shipment');
      return await response.json();
    } catch (error) {
      console.error('Error fetching current shipment:', error);
      throw error;
    }
  }

  static async updateDriverLocation(driverId, location) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to update location');
      return await response.json();
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  static async updateCheckpointStatus(deliveryId, checkpointId, status, notes = '', photoUrl = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}/checkpoints/${checkpointId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          photoUrl,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to update checkpoint');
      return await response.json();
    } catch (error) {
      console.error('Error updating checkpoint:', error);
      throw error;
    }
  }


  static async getDriverDeliveryHistory(driverId, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/deliveries?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch delivery history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      throw error;
    }
  }

  // Checkpoint methods
  static async getCheckpoints(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/checkpoints?${params}`);
      if (!response.ok) throw new Error('Failed to fetch checkpoints');
      return await response.json();
    } catch (error) {
      console.error('Error fetching checkpoints:', error);
      throw error;
    }
  }

  static async getCheckpoint(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkpoints/${id}`);
      if (!response.ok) throw new Error('Failed to fetch checkpoint');
      return await response.json();
    } catch (error) {
      console.error('Error fetching checkpoint:', error);
      throw error;
    }
  }

  static async createCheckpoint(checkpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkpoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkpoint)
      });
      if (!response.ok) throw new Error('Failed to create checkpoint');
      return await response.json();
    } catch (error) {
      console.error('Error creating checkpoint:', error);
      throw error;
    }
  }

  static async updateCheckpoint(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkpoints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update checkpoint');
      return await response.json();
    } catch (error) {
      console.error('Error updating checkpoint:', error);
      throw error;
    }
  }

  // Map methods using free APIs
  static async getCheckpointsInBounds(bounds) {
    try {
      const params = new URLSearchParams(bounds);
      const response = await fetch(`${API_BASE_URL}/map/checkpoints-in-bounds?${params}`);
      if (!response.ok) throw new Error('Failed to fetch checkpoints in bounds');
      return await response.json();
    } catch (error) {
      console.error('Error fetching checkpoints in bounds:', error);
      throw error;
    }
  }

  static async getRouteDirections(coordinates) {
    try {
      const response = await fetch(`${API_BASE_URL}/route/directions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates })
      });
      if (!response.ok) throw new Error('Failed to get route directions');
      return await response.json();
    } catch (error) {
      console.error('Error getting route directions:', error);
      throw error;
    }
  }

  static async optimizeRoute(origin, destination, waypoints = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/route/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, waypoints })
      });
      if (!response.ok) throw new Error('Failed to optimize route');
      return await response.json();
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw error;
    }
  }

  static async geocodeAddress(address) {
    try {
      const params = new URLSearchParams({ address });
      const response = await fetch(`${API_BASE_URL}/geocode?${params}`);
      if (!response.ok) throw new Error('Failed to geocode address');
      return await response.json();
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }

  static async reverseGeocode(lat, lng) {
    try {
      const params = new URLSearchParams({ lat, lng });
      const response = await fetch(`${API_BASE_URL}/reverse-geocode?${params}`);
      if (!response.ok) throw new Error('Failed to reverse geocode');
      return await response.json();
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  // Shipment methods
  static async getShipments(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/shipments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch shipments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    }
  }

  static async getShipment(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}`);
      if (!response.ok) throw new Error('Failed to fetch shipment');
      return await response.json();
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  }

  static async createShipment(shipment) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment)
      });
      if (!response.ok) throw new Error('Failed to create shipment');
      return await response.json();
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  static async updateShipmentLocation(id, location) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${id}/location-realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location)
      });
      if (!response.ok) throw new Error('Failed to update shipment location');
      return await response.json();
    } catch (error) {
      console.error('Error updating shipment location:', error);
      throw error;
    }
  }

  // Geofencing
  static async checkGeofence(shipmentId, radius = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/geofence/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, radius })
      });
      if (!response.ok) throw new Error('Failed to check geofence');
      return await response.json();
    } catch (error) {
      console.error('Error checking geofence:', error);
      throw error;
    }
  }

  static async findNearbyCheckpoints(lat, lng, radius = 50, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/checkpoints/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng, radius, limit })
      });
      if (!response.ok) throw new Error('Failed to find nearby checkpoints');
      return await response.json();
    } catch (error) {
      console.error('Error finding nearby checkpoints:', error);
      throw error;
    }
  }

  // Analytics
  static async getCheckpointUtilization() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/checkpoint-utilization`);
      if (!response.ok) throw new Error('Failed to fetch checkpoint utilization');
      return await response.json();
    } catch (error) {
      console.error('Error fetching checkpoint utilization:', error);
      throw error;
    }
  }

  static async getShipmentStatusSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/shipment-status-summary`);
      if (!response.ok) throw new Error('Failed to fetch shipment status summary');
      return await response.json();
    } catch (error) {
      console.error('Error fetching shipment status summary:', error);
      throw error;
    }
  }

  // Emergency and notifications
  static async triggerEmergency(driverId, location, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId,
          location,
          message,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to trigger emergency');
      return await response.json();
    } catch (error) {
      console.error('Error triggering emergency:', error);
      throw error;
    }
  }

  static async sendDeliveryNotification(shipmentId, type, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentId,
          type,
          message,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to send notification');
      return await response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Photo upload for proof of delivery
  static async uploadDeliveryPhoto(shipmentId, file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('shipmentId', shipmentId);
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(`${API_BASE_URL}/delivery-photos`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload photo');
      return await response.json();
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  // WebSocket methods for real-time functionality
  trackShipment(shipmentId, onUpdate) {
    const socket = this.initializeWebSocket();
    socket.emit('track-shipment', shipmentId);
    socket.on('shipment-update', onUpdate);
    return () => {
      socket.emit('stop-tracking', shipmentId);
      socket.off('shipment-update', onUpdate);
    };
  }

  // Utility methods
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  }

  // Error handling wrapper
  static async apiCall(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const api = new SupplyChainAPI();

export default SupplyChainAPI;
export { api };