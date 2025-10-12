# Gemini AI Integration for Delay Analysis

## Overview
This implementation integrates Google's Gemini AI to analyze delivery delays by considering current location, destination, weather conditions, and traffic patterns.

## Features Implemented

### 1. Intelligent Delay Computation
- **Location-based Analysis**: Uses current driver location and destination
- **Weather Impact**: Integrates real-time weather data from OpenWeatherMap
- **Traffic Considerations**: Analyzes traffic patterns based on time and location
- **AI-Powered Insights**: Gemini AI provides intelligent delay predictions and recommendations

### 2. Real-time Updates
- **Auto-refresh**: Delay analysis updates every 5 minutes
- **Manual Refresh**: Drivers can manually trigger analysis
- **WebSocket Integration**: Real-time updates through existing socket infrastructure

### 3. Visual Dashboard Integration
- **Delay Analysis Card**: Shows current delay status with color-coded risk levels
- **Impact Breakdown**: Displays weather and traffic impact percentages
- **Recommendations**: AI-generated suggestions for route optimization

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install @google/generative-ai node-fetch
```

### 2. Configure Environment Variables
Add to your `.env` file:
```env
# Required for Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Required for weather data
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional for enhanced routing
OPENROUTESERVICE_API_KEY=your_openrouteservice_key_here
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### 3. Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### OpenWeatherMap API Key (Free)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key (60 calls/minute, 1M calls/month)
3. Add to `.env` file

### 4. Start the Server
```bash
npm run dev
```

## API Endpoints

### Analyze Delivery Delay
```http
POST /api/delay/analyze-delay
Content-Type: application/json

{
  "currentLocation": {
    "lat": 19.0760,
    "lng": 72.8777
  },
  "destination": {
    "lat": 18.5204,
    "lng": 73.8567
  },
  "vehicleType": "truck",
  "deliveryId": "DEL123"
}
```

### Get Delay Status
```http
GET /api/delay/delivery/{deliveryId}/delay-status
```

## Frontend Integration

### Using the Hook
```jsx
import { useDelayAnalysis } from '@/hooks/useDelayAnalysis';

function DeliveryComponent({ deliveryId, currentLocation, destination }) {
  const {
    delayData,
    isAnalyzing,
    estimatedDelay,
    riskLevel,
    recommendations
  } = useDelayAnalysis(deliveryId, currentLocation, destination);

  return (
    <div>
      <p>Estimated Delay: {estimatedDelay} minutes</p>
      <p>Risk Level: {riskLevel}</p>
    </div>
  );
}
```

### Using the Component
```jsx
import DelayAnalysisCard from '@/components/DelayAnalysisCard';

<DelayAnalysisCard
  deliveryId={delivery.id}
  currentLocation={currentLocation}
  destination={delivery.destination}
/>
```

## How It Works

### 1. Data Collection
- **Location**: Current driver GPS coordinates and destination
- **Weather**: Real-time weather from OpenWeatherMap API
- **Traffic**: Time-based traffic estimation (can be enhanced with real traffic APIs)
- **Route**: Distance and duration calculations

### 2. AI Analysis
- **Gemini Processing**: Sends structured prompt with all contextual data
- **Intelligent Reasoning**: AI considers weather impact, traffic patterns, vehicle constraints
- **Risk Assessment**: Categorizes delays as low/medium/high risk
- **Recommendations**: Provides actionable suggestions

### 3. Response Processing
- **JSON Parsing**: Extracts structured data from AI response
- **Fallback Logic**: Handles API failures with basic calculations
- **Real-time Updates**: Continuously monitors conditions

## Customization Options

### 1. Enhanced Weather Integration
```javascript
// Add more weather parameters
const weatherData = {
  temperature: data.main.temp,
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  windDirection: data.wind.deg,
  cloudCover: data.clouds.all
};
```

### 2. Real Traffic APIs
```javascript
// Integrate with Google Maps Traffic API
const trafficData = await getGoogleTrafficData(origin, destination);

// Or use Mapbox Traffic API
const trafficData = await getMapboxTrafficData(coordinates);
```

### 3. Vehicle-Specific Analysis
```javascript
const vehicleConstraints = {
  type: 'truck',
  weight: 15000, // kg
  height: 4.2,   // meters
  hazmat: false,
  refrigerated: true
};
```

## Error Handling

### 1. API Failures
- Graceful fallback to basic calculations
- Error logging and monitoring
- User-friendly error messages

### 2. Network Issues
- Retry logic with exponential backoff
- Offline mode with cached data
- Progressive enhancement

## Performance Optimization

### 1. Caching
- Cache weather data for 10 minutes
- Cache traffic patterns by time/location
- Store AI responses for similar routes

### 2. Rate Limiting
- Respect API rate limits
- Implement request queuing
- Use efficient polling intervals

## Security Considerations

### 1. API Key Protection
- Store keys in environment variables
- Use server-side API calls only
- Implement key rotation

### 2. Data Privacy
- Anonymize location data when possible
- Implement data retention policies
- Secure API endpoints

## Monitoring and Analytics

### 1. Performance Metrics
- API response times
- Accuracy of delay predictions
- User engagement with recommendations

### 2. Business Intelligence
- Delay pattern analysis
- Route optimization insights
- Weather impact correlations

## Future Enhancements

### 1. Machine Learning
- Train models on historical delay data
- Improve prediction accuracy over time
- Personalized recommendations

### 2. Advanced Integrations
- Real-time traffic cameras
- Road construction databases
- Fleet management systems

### 3. Predictive Analytics
- Seasonal delay patterns
- Customer behavior analysis
- Supply chain optimization

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key validity
   - Verify request format
   - Monitor rate limits

2. **Weather API Failures**
   - Validate coordinates
   - Check API key permissions
   - Handle timeout errors

3. **Frontend Integration**
   - Verify environment variables
   - Check CORS configuration
   - Debug WebSocket connections

### Debug Mode
Enable detailed logging:
```env
DEBUG=true
LOG_LEVEL=debug
```

## Support
For issues and questions:
1. Check the console logs
2. Verify API key configuration
3. Test with sample data
4. Review network requests

This implementation provides a solid foundation for AI-powered delay analysis that can be extended and customized based on your specific requirements.