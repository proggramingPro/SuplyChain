import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Cloud, 
  Car, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useDelayAnalysis } from '@/hooks/useDelayAnalysis';

export default function DelayAnalysisCard({ 
  deliveryId, 
  currentLocation, 
  destination, 
  className = "" 
}) {
  const {
    delayData,
    isAnalyzing,
    error,
    lastUpdated,
    analyzeDelay,
    getDelayColor,
    getDelayMessage,
    estimatedDelay,
    riskLevel,
    delayFactors,
    recommendations,
    weatherImpact,
    trafficImpact
  } = useDelayAnalysis(deliveryId, currentLocation, destination);

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskBadgeVariant = () => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Delay analysis unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getRiskIcon()}
            Delivery Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getRiskBadgeVariant()}>
              {typeof riskLevel === 'string' ? riskLevel.toUpperCase() : 'UNKNOWN'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => analyzeDelay()}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Delay Status */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold" style={{ color: getDelayColor() }}>
            {isAnalyzing ? 'Analyzing...' : (getDelayMessage()?.includes('NaN') ? 'On schedule' : getDelayMessage())}
          </div>
          {delayData?.analysis?.estimatedArrival && (
            <div className="text-lg font-semibold text-blue-600 mt-2">
              ETA: {delayData.analysis.estimatedArrival}
            </div>
          )}
          {delayData?.analysis?.totalDeliveryTime && (
            <div className="text-sm text-gray-600">
              Total time: {delayData.analysis.totalDeliveryTime} minutes
            </div>
          )}
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Impact Breakdown */}
        {delayData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-500" />
                <span>Weather Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={weatherImpact} className="w-16 h-2" />
                <span className="font-medium">{weatherImpact}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-orange-500" />
                <span>Traffic Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={trafficImpact} className="w-16 h-2" />
                <span className="font-medium">{trafficImpact}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Delay Factors */}
        {delayFactors.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Contributing Factors:</h4>
            <div className="space-y-1">
              {delayFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{typeof factor === 'object' ? factor.factor || JSON.stringify(factor) : factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
            <div className="space-y-1">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{typeof rec === 'object' ? rec.recommendation || JSON.stringify(rec) : rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Data */}
        {delayData?.contextData && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-4 text-xs">
              {delayData.contextData.weather && (
                <div>
                  <div className="font-medium text-gray-700">Weather</div>
                  <div className="text-gray-600">
                    {delayData.contextData.weather.description}
                  </div>
                  <div className="text-gray-600">
                    {Math.round(delayData.contextData.weather.temperature)}°C
                  </div>
                </div>
              )}
              
              {delayData.contextData.traffic && (
                <div>
                  <div className="font-medium text-gray-700">Traffic</div>
                  <div className="text-gray-600 capitalize">
                    {delayData.contextData.traffic.level} congestion
                  </div>
                  <div className="text-gray-600">
                    {delayData.contextData.traffic.averageSpeed} km/h avg
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}