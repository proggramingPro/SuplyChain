const { GoogleGenerativeAI } = require('@google/generative-ai');

class EnhancedDeliveryService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.lastRequest = 0;
    this.requestCount = 0;
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Main method to calculate comprehensive delivery predictions
   */
  async calculateDeliveryPrediction(deliveryData) {
    const {
      currentLocation,
      destination,
      pickupDate = new Date(),
      vehicleType = 'truck',
      packageWeight = 0,
      packageDimensions = {},
      priority = 'standard',
      multipleStops = []
    } = deliveryData;

    try {
      // Gather all necessary data in parallel
      const [weatherData, trafficData, routeInfo] = await Promise.all([
        this.getWeatherData(currentLocation.lat, currentLocation.lng),
        this.getTrafficData(currentLocation, destination),
        this.calculateRouteInfo(currentLocation, destination, multipleStops)
      ]);

      // Calculate delays with AI assistance
      const delayAnalysis = await this.computeDeliveryDelay({
        currentLocation,
        destination,
        weatherData,
        trafficData,
        routeInfo,
        vehicleType,
        timeOfDay: new Date().getHours(),
        packageWeight,
        priority
      });

      // Calculate final delivery date and time
      const deliverySchedule = this.calculateDeliverySchedule(
        pickupDate,
        routeInfo,
        delayAnalysis,
        multipleStops,
        priority
      );

      // Compile comprehensive response
      return {
        success: true,
        deliverySchedule,
        delayAnalysis,
        routeInfo,
        environmentalConditions: {
          weather: weatherData,
          traffic: trafficData
        },
        recommendations: this.generateRecommendations(delayAnalysis, weatherData, trafficData),
        tracking: {
          estimatedProgress: this.calculateProgressMilestones(deliverySchedule, routeInfo),
          checkpoints: this.generateCheckpoints(routeInfo, multipleStops)
        }
      };
    } catch (error) {
      console.error('Delivery prediction error:', error);
      return this.getFallbackPrediction(deliveryData);
    }
  }

  /**
   * Enhanced delay calculation with AI
   */
  async computeDeliveryDelay(locationData) {
    const {
      currentLocation,
      destination,
      weatherData,
      trafficData,
      routeInfo,
      vehicleType = 'truck',
      timeOfDay = new Date().getHours(),
      packageWeight = 0,
      priority = 'standard'
    } = locationData;

    const prompt = `
    As a logistics AI assistant, analyze this delivery scenario and provide precise delay calculations:

    ROUTE INFORMATION:
    - Origin: ${currentLocation.lat}, ${currentLocation.lng}
    - Destination: ${destination.lat}, ${destination.lng}
    - Distance: ${routeInfo.distance} km
    - Base Duration: ${routeInfo.duration} minutes
    - Vehicle: ${vehicleType}
    - Time: ${timeOfDay}:00
    - Package Weight: ${packageWeight} kg
    - Priority: ${priority}

    WEATHER CONDITIONS:
    ${weatherData ? `
    - Temperature: ${weatherData.temperature}°C
    - Conditions: ${weatherData.description}
    - Visibility: ${weatherData.visibility} km
    - Wind Speed: ${weatherData.windSpeed} km/h
    - Precipitation: ${weatherData.precipitation || 0}mm
    ` : 'Weather data unavailable'}

    TRAFFIC CONDITIONS:
    ${trafficData ? `
    - Traffic Level: ${trafficData.level}
    - Average Speed: ${trafficData.averageSpeed} km/h
    - Congestion: ${trafficData.congestionPoints || 'None'}
    - Incidents: ${trafficData.incidents || 'None'}
    ` : 'Traffic data unavailable'}

    Provide JSON response with:
    {
      "estimatedDelayMinutes": <number>,
      "totalDeliveryTimeMinutes": <number>,
      "delayFactors": [
        {"factor": "name", "impact": "percentage", "delayMinutes": <number>}
      ],
      "riskLevel": "low|medium|high",
      "confidenceScore": <0-100>,
      "recommendations": ["suggestion1", "suggestion2"],
      "alternativeRoutesSuggested": <boolean>,
      "weatherImpactPercent": <number>,
      "trafficImpactPercent": <number>,
      "optimalDepartureTime": "HH:MM",
      "seasonalFactors": ["factor1", "factor2"]
    }

    Consider: weather driving impact, traffic patterns, vehicle limitations, time-based patterns, road safety, seasonal variations, and priority level urgency.
    `;

    try {
      // Check cache first
      const cacheKey = this.getCacheKey(locationData);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // Rate limiting
      if (!this.checkRateLimit()) {
        console.log('Rate limit reached, using fallback');
        return this.getFallbackDelay(locationData);
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        this.setCache(cacheKey, parsed);
        return parsed;
      }
      
      return this.parseGeminiResponse(text, locationData);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackDelay(locationData);
    }
  }

  /**
   * Calculate complete delivery schedule with date and time
   */
  calculateDeliverySchedule(pickupDate, routeInfo, delayAnalysis, multipleStops, priority) {
    const pickupTime = new Date(pickupDate);
    
    // Calculate processing time based on priority
    const processingTime = this.getProcessingTime(priority);
    
    // Calculate total travel time
    const totalTravelMinutes = delayAnalysis.totalDeliveryTimeMinutes || 
                               (routeInfo.duration + delayAnalysis.estimatedDelayMinutes);
    
    // Add stop times if multiple stops
    const stopTime = multipleStops.length * 15; // 15 minutes per stop
    
    // Add loading/unloading time
    const handlingTime = 30; // 30 minutes
    
    // Calculate rest breaks for long journeys (required every 4.5 hours)
    const restBreaks = Math.floor(totalTravelMinutes / 270) * 30;
    
    // Total time calculation
    const totalMinutes = processingTime + totalTravelMinutes + stopTime + handlingTime + restBreaks;
    
    // Calculate estimated delivery time
    const estimatedDelivery = new Date(pickupTime.getTime() + totalMinutes * 60000);
    
    // Calculate working hours adjustments (assuming 6 AM - 10 PM delivery window)
    const adjustedDelivery = this.adjustForBusinessHours(estimatedDelivery);
    
    // Calculate earliest and latest delivery times
    const earliestDelivery = new Date(adjustedDelivery.getTime() - 30 * 60000);
    const latestDelivery = new Date(adjustedDelivery.getTime() + 60 * 60000);
    
    return {
      pickupDate: pickupTime.toISOString(),
      estimatedDeliveryDate: adjustedDelivery.toISOString(),
      estimatedDeliveryTime: adjustedDelivery.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      deliveryDate: adjustedDelivery.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      deliveryWindow: {
        earliest: earliestDelivery.toISOString(),
        latest: latestDelivery.toISOString()
      },
      timeBreakdown: {
        processingTime,
        travelTime: totalTravelMinutes,
        stopTime,
        handlingTime,
        restBreaks,
        totalMinutes
      },
      businessDays: this.calculateBusinessDays(pickupTime, adjustedDelivery),
      isExpedited: priority === 'express' || priority === 'overnight'
    };
  }

  /**
   * Enhanced weather data retrieval
   */
  async getWeatherData(lat, lng) {
    const cacheKey = `weather-${lat}-${lng}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return this.getFallbackWeatherData();
      }
      
      const data = await response.json();
      const current = data.current_weather;
      
      const weatherData = {
        temperature: current.temperature,
        description: this.getWeatherDescription(current.weathercode),
        weatherCode: current.weathercode,
        visibility: 10,
        windSpeed: current.windspeed,
        precipitation: 0,
        isHazardous: this.isHazardousWeather(current.weathercode),
        severity: this.getWeatherSeverity(current.weathercode)
      };
      
      this.setCache(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      return this.getFallbackWeatherData();
    }
  }

  /**
   * Fallback weather data when API is unavailable
   */
  getFallbackWeatherData() {
    return {
      temperature: 25,
      description: 'clear sky',
      weatherCode: 0,
      visibility: 10,
      windSpeed: 5,
      precipitation: 0,
      isHazardous: false,
      severity: 'low',
      isFallback: true
    };
  }

  /**
   * Enhanced traffic data with time-based patterns
   */
  async getTrafficData(currentLocation, destination) {
    try {
      const timeOfDay = new Date().getHours();
      const dayOfWeek = new Date().getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let trafficLevel = 'low';
      let averageSpeed = 60;
      let congestionFactor = 1.0;
      
      // Enhanced peak hours logic
      if (!isWeekend) {
        if (timeOfDay >= 7 && timeOfDay <= 9) {
          trafficLevel = 'high';
          averageSpeed = 25;
          congestionFactor = 2.5;
        } else if (timeOfDay >= 17 && timeOfDay <= 19) {
          trafficLevel = 'high';
          averageSpeed = 30;
          congestionFactor = 2.2;
        } else if (timeOfDay >= 10 && timeOfDay <= 16) {
          trafficLevel = 'medium';
          averageSpeed = 45;
          congestionFactor = 1.3;
        }
      } else {
        if (timeOfDay >= 11 && timeOfDay <= 14) {
          trafficLevel = 'medium';
          averageSpeed = 50;
          congestionFactor = 1.2;
        }
      }

      return {
        level: trafficLevel,
        averageSpeed,
        congestionFactor,
        congestionPoints: trafficLevel === 'high' ? 'City center, major highways' : 'None',
        incidents: 'None reported',
        historicalPattern: this.getHistoricalTrafficPattern(timeOfDay, dayOfWeek),
        predictedClearance: this.predictTrafficClearance(timeOfDay, trafficLevel)
      };
    } catch (error) {
      console.error('Traffic data error:', error);
      return null;
    }
  }

  /**
   * Calculate route information including multiple stops
   */
  calculateRouteInfo(currentLocation, destination, multipleStops = []) {
    let totalDistance = 0;
    let currentPoint = currentLocation;

    // Calculate distance through all stops
    [...multipleStops, destination].forEach(stop => {
      totalDistance += this.calculateDistance(
        currentPoint.lat, currentPoint.lng,
        stop.lat, stop.lng
      );
      currentPoint = stop;
    });

    const straightLineDistance = this.calculateDistance(
      currentLocation.lat, currentLocation.lng,
      destination.lat, destination.lng
    );

    const duration = Math.round(totalDistance / 50 * 60); // 50 km/h average

    return {
      distance: Math.round(totalDistance),
      duration,
      straightLineDistance: Math.round(straightLineDistance),
      estimatedFuelCost: this.estimateFuelCost(totalDistance),
      tollsEstimate: this.estimateTolls(totalDistance)
    };
  }

  /**
   * Get or estimate route information (legacy method)
   */
  async getRouteInfo(origin, destination) {
    // Calculate straight-line distance
    const distance = this.calculateDistance(
      origin.lat, origin.lng,
      destination.lat, destination.lng
    );
    
    // Estimate road distance (typically 1.3x straight line)
    const roadDistance = distance * 1.3;
    
    // Estimate duration based on average speed
    const averageSpeed = 50; // km/h
    const duration = (roadDistance / averageSpeed) * 60; // minutes
    
    return {
      distance: Math.round(roadDistance),
      duration: Math.round(duration),
      straightLineDistance: Math.round(distance),
      estimatedFuelCost: this.estimateFuelCost(roadDistance),
      tollsEstimate: this.estimateTolls(roadDistance)
    };
  }

  /**
   * Calculate progress milestones
   */
  calculateProgressMilestones(deliverySchedule, routeInfo) {
    const pickupTime = new Date(deliverySchedule.pickupDate);
    const deliveryTime = new Date(deliverySchedule.estimatedDeliveryDate);
    const totalDuration = deliveryTime - pickupTime;
    
    const milestones = [];
    const checkpoints = [0.25, 0.5, 0.75, 1.0];
    
    checkpoints.forEach(checkpoint => {
      const time = new Date(pickupTime.getTime() + totalDuration * checkpoint);
      const distance = Math.round(routeInfo.distance * checkpoint);
      
      milestones.push({
        percentage: checkpoint * 100,
        distance: distance,
        estimatedTime: time.toISOString(),
        status: checkpoint === 1.0 ? 'Delivered' : 'In Transit'
      });
    });
    
    return milestones;
  }

  /**
   * Generate delivery checkpoints
   */
  generateCheckpoints(routeInfo, multipleStops) {
    const checkpoints = [
      { type: 'pickup', status: 'pending', description: 'Package pickup' },
      { type: 'departure', status: 'pending', description: 'Departed from origin' }
    ];
    
    multipleStops.forEach((stop, index) => {
      checkpoints.push({
        type: 'stop',
        status: 'pending',
        description: `Stop ${index + 1}: ${stop.name || 'Intermediate location'}`
      });
    });
    
    checkpoints.push(
      { type: 'arrival', status: 'pending', description: 'Arrived at destination' },
      { type: 'delivery', status: 'pending', description: 'Package delivered' }
    );
    
    return checkpoints;
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(delayAnalysis, weatherData, trafficData) {
    const recommendations = [];
    
    if (delayAnalysis.riskLevel === 'high') {
      recommendations.push('Consider postponing delivery or using alternative route');
    }
    
    if (weatherData?.isHazardous) {
      recommendations.push(`Hazardous weather detected: ${weatherData.description}`);
    }
    
    if (trafficData?.level === 'high') {
      recommendations.push(`Heavy traffic expected. Optimal departure: ${delayAnalysis.optimalDepartureTime || 'early morning'}`);
    }
    
    if (delayAnalysis.totalDeliveryTimeMinutes > 480) {
      recommendations.push('Ensure driver adheres to mandatory rest periods for long journey safety');
    }
    
    // Return only the most important recommendation
    return recommendations.length > 0 ? [recommendations[0]] : ['Monitor delivery progress'];
  }

  // ==================== HELPER METHODS ====================

  checkRateLimit() {
    const now = Date.now();
    if (now - this.lastRequest < 60000) {
      this.requestCount++;
      if (this.requestCount > 8) return false;
    } else {
      this.requestCount = 1;
      this.lastRequest = now;
    }
    return true;
  }

  getCacheKey(data) {
    return `${data.currentLocation.lat}-${data.currentLocation.lng}-${data.destination.lat}-${data.destination.lng}-${new Date().getHours()}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  getProcessingTime(priority) {
    const times = {
      'overnight': 30,
      'express': 60,
      'standard': 120,
      'economy': 240
    };
    return times[priority] || 120;
  }

  calculateBusinessDays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }

  adjustForBusinessHours(date) {
    const hour = date.getHours();
    
    // If delivery falls outside 6 AM - 10 PM window
    if (hour < 6) {
      date.setHours(6, 0, 0, 0);
    } else if (hour >= 22) {
      date.setDate(date.getDate() + 1);
      date.setHours(6, 0, 0, 0);
    }
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) date.setDate(date.getDate() + 1);
    if (dayOfWeek === 6) date.setDate(date.getDate() + 2);
    
    return date;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
      45: 'fog', 48: 'depositing rime fog',
      51: 'light drizzle', 53: 'moderate drizzle', 55: 'dense drizzle',
      61: 'slight rain', 63: 'moderate rain', 65: 'heavy rain',
      71: 'slight snow', 73: 'moderate snow', 75: 'heavy snow',
      77: 'snow grains', 80: 'slight rain showers', 81: 'moderate rain showers',
      82: 'violent rain showers', 85: 'slight snow showers', 86: 'heavy snow showers',
      95: 'thunderstorm', 96: 'thunderstorm with slight hail', 99: 'thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'unknown';
  }

  isHazardousWeather(code) {
    const hazardous = [45, 48, 65, 75, 77, 82, 86, 95, 96, 99];
    return hazardous.includes(code);
  }

  getWeatherSeverity(code) {
    if ([99, 96, 86, 82, 75].includes(code)) return 'severe';
    if ([95, 65, 73, 85, 81, 48].includes(code)) return 'moderate';
    return 'low';
  }

  getHistoricalTrafficPattern(hour, dayOfWeek) {
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (hour >= 7 && hour <= 9) return 'morning-peak';
      if (hour >= 17 && hour <= 19) return 'evening-peak';
      if (hour >= 10 && hour <= 16) return 'midday';
    }
    return 'off-peak';
  }

  predictTrafficClearance(currentHour, trafficLevel) {
    if (trafficLevel === 'high') {
      if (currentHour >= 7 && currentHour <= 9) return '10:00 AM';
      if (currentHour >= 17 && currentHour <= 19) return '8:00 PM';
    }
    return 'Current';
  }

  estimateFuelCost(distance) {
    const fuelEfficiency = 8; // km per liter
    const fuelPrice = 1.5; // USD per liter
    return Math.round((distance / fuelEfficiency) * fuelPrice * 100) / 100;
  }

  estimateTolls(distance) {
    // Rough estimate: $0.10 per km for highway tolls
    return Math.round(distance * 0.10 * 100) / 100;
  }

  parseGeminiResponse(text, locationData) {
    const delayMatch = text.match(/delay[:\s]*(\d+)/i);
    const riskMatch = text.match(/risk[:\s]*(low|medium|high)/i);
    const delay = delayMatch ? parseInt(delayMatch[1]) : 0;
    const totalTime = (locationData.routeInfo?.duration || 60) + delay;
    
    return {
      estimatedDelayMinutes: delay,
      totalDeliveryTimeMinutes: totalTime,
      delayFactors: [
        { factor: 'Weather conditions', impact: '10%', delayMinutes: Math.round(delay * 0.4) },
        { factor: 'Traffic patterns', impact: '15%', delayMinutes: Math.round(delay * 0.6) }
      ],
      riskLevel: riskMatch ? riskMatch[1].toLowerCase() : 'low',
      confidenceScore: 65,
      recommendations: ['Monitor weather conditions', 'Check traffic updates'],
      alternativeRoutesSuggested: false,
      weatherImpactPercent: 10,
      trafficImpactPercent: 15,
      optimalDepartureTime: '06:00',
      seasonalFactors: []
    };
  }

  getFallbackDelay(locationData) {
    let weatherDelay = 0;
    let trafficDelay = 0;

    if (locationData.weatherData) {
      if (locationData.weatherData.precipitation > 5) weatherDelay += 15;
      if (locationData.weatherData.visibility < 5) weatherDelay += 10;
      if (locationData.weatherData.isHazardous) weatherDelay += 30;
    }

    if (locationData.trafficData) {
      const trafficMultiplier = locationData.trafficData.congestionFactor || 1;
      if (locationData.trafficData.level === 'high') trafficDelay += 20 * trafficMultiplier;
      else if (locationData.trafficData.level === 'medium') trafficDelay += 10 * trafficMultiplier;
    }

    const totalDelay = weatherDelay + trafficDelay;
    const totalTime = (locationData.routeInfo?.duration || 60) + totalDelay;
    
    return {
      estimatedDelayMinutes: totalDelay,
      totalDeliveryTimeMinutes: totalTime,
      delayFactors: [
        { factor: 'Weather conditions', impact: `${Math.round((weatherDelay/totalDelay)*100)}%`, delayMinutes: weatherDelay },
        { factor: 'Traffic congestion', impact: `${Math.round((trafficDelay/totalDelay)*100)}%`, delayMinutes: trafficDelay }
      ],
      riskLevel: totalDelay > 40 ? 'high' : totalDelay > 20 ? 'medium' : 'low',
      confidenceScore: 70,
      recommendations: [
        'Monitor real-time conditions',
        'Consider alternative routes',
        'Update customer with revised ETA'
      ],
      alternativeRoutesSuggested: totalDelay > 30,
      weatherImpactPercent: Math.round((weatherDelay/totalTime)*100),
      trafficImpactPercent: Math.round((trafficDelay/totalTime)*100),
      optimalDepartureTime: this.calculateOptimalDeparture(),
      seasonalFactors: this.getSeasonalFactors()
    };
  }

  getFallbackPrediction(deliveryData) {
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return {
      success: false,
      error: 'Using fallback prediction',
      deliverySchedule: {
        pickupDate: now.toISOString(),
        estimatedDeliveryDate: estimatedDelivery.toISOString(),
        estimatedDeliveryTime: estimatedDelivery.toLocaleString(),
        deliveryWindow: {
          earliest: new Date(estimatedDelivery.getTime() - 30 * 60000).toISOString(),
          latest: new Date(estimatedDelivery.getTime() + 60 * 60000).toISOString()
        },
        timeBreakdown: {
          processingTime: 120,
          travelTime: 1200,
          stopTime: 0,
          handlingTime: 30,
          restBreaks: 30,
          totalMinutes: 1380
        },
        businessDays: 1,
        isExpedited: false
      },
      recommendations: [{
        priority: 'medium',
        message: 'Unable to fetch real-time data. Using estimated values.',
        action: 'retry_later'
      }]
    };
  }

  calculateOptimalDeparture() {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return '06:00';
    if (hour >= 6 && hour < 7) return '06:00';
    return '20:00'; // Next evening off-peak
  }

  getSeasonalFactors() {
    const month = new Date().getMonth();
    const factors = [];
    
    if (month >= 5 && month <= 8) {
      factors.push('Summer vacation traffic');
    } else if (month === 11 || month === 0) {
      factors.push('Holiday season delays');
    } else if (month >= 1 && month <= 3) {
      factors.push('Winter weather conditions');
    }
    
    return factors;
  }
}

module.exports = new EnhancedDeliveryService();