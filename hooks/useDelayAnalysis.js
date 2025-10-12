import { useState, useEffect, useCallback, useMemo } from 'react';

export const useDelayAnalysis = (deliveryId, currentLocation, destination) => {
  const [delayData, setDelayData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Memoize location strings to prevent unnecessary re-renders
  const locationKey = useMemo(() => {
    if (!currentLocation || !destination) return null;
    return `${currentLocation.lat}-${currentLocation.lng}-${destination.lat}-${destination.lng}`;
  }, [currentLocation?.lat, currentLocation?.lng, destination?.lat, destination?.lng]);

  const analyzeDelay = useCallback(async (locationData = {}) => {
    if (!currentLocation || !destination || !process.env.NEXT_PUBLIC_API_URL) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delay/analyze-delay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLocation,
          destination,
          vehicleType: locationData.vehicleType || 'truck',
          deliveryId
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend returned non-JSON response');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      setDelayData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Delay analysis error:', err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [locationKey, deliveryId]);

  const getDelayStatus = useCallback(async () => {
    if (!deliveryId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delay/delivery/${deliveryId}/delay-status`
      );

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setDelayData(prev => ({
          ...prev,
          analysis: data.delayStatus,
          timestamp: data.lastUpdated
        }));
      }
    } catch (err) {
      console.error('Delay status error:', err);
    }
  }, [deliveryId]);

  // Delay analysis disabled to prevent React errors
  // Call analyzeDelay() manually when needed

  const getDelayColor = () => {
    if (!delayData?.analysis) return 'gray';
    
    const riskLevel = delayData.analysis.riskLevel;
    switch (riskLevel) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatTime = (minutes) => {
    if (minutes == null || isNaN(minutes)) return '0 min';
    const absMinutes = Math.abs(Math.round(minutes));
    if (absMinutes < 60) return `${absMinutes} min`;
    if (absMinutes < 1440) {
      const hours = Math.floor(absMinutes / 60);
      const mins = absMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    const days = Math.floor(absMinutes / 1440);
    const hours = Math.floor((absMinutes % 1440) / 60);
    const mins = absMinutes % 60;
    let result = `${days}d`;
    if (hours > 0) result += ` ${hours}h`;
    if (mins > 0) result += ` ${mins}min`;
    return result;
  };

  const getDelayMessage = () => {
    if (!delayData?.analysis) return 'Analyzing...';
    
    const delay = delayData.analysis.estimatedDelay;
    if (delay == null || isNaN(delay)) return 'On time';
    if (delay === 0) return 'On time';
    if (delay > 0) return `${formatTime(delay)} delay expected`;
    return `${formatTime(delay)} ahead of schedule`;
  };

  const getTotalTime = () => {
    if (!delayData?.analysis) return 'Calculating...';
    const baseTime = delayData.contextData?.route?.duration || 0;
    const delay = delayData.analysis.estimatedDelay || 0;
    return formatTime(baseTime + delay);
  };

  const formatImpact = (impact) => {
    if (impact === 0) return 'No impact';
    if (impact > 0) return `+${impact}% slower`;
    return `${Math.abs(impact)}% faster`;
  };

  const getDeliveryDate = () => {
    if (!delayData?.analysis) return 'Calculating...';
    const totalMinutes = (delayData.contextData?.route?.duration || 0) + (delayData.analysis.estimatedDelay || 0);
    const deliveryDate = new Date(Date.now() + totalMinutes * 60000);
    return deliveryDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    delayData,
    isAnalyzing,
    error,
    lastUpdated,
    analyzeDelay,
    getDelayStatus,
    getDelayColor,
    getDelayMessage,
    formatTime,
    getTotalTime,
    formatImpact,
    getDeliveryDate,
    // Computed values for easy access
    estimatedDelay: delayData?.analysis?.estimatedDelay || 0,
    totalTime: (delayData?.contextData?.route?.duration || 0) + (delayData?.analysis?.estimatedDelay || 0),
    riskLevel: delayData?.analysis?.riskLevel || 'low',
    delayFactors: delayData?.analysis?.delayFactors || [],
    recommendations: delayData?.analysis?.recommendations || [],
    weatherImpact: delayData?.analysis?.weatherImpact || 0,
    trafficImpact: delayData?.analysis?.trafficImpact || 0
  };
};