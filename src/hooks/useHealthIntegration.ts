
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define constants for platform detection
const isIOS = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
const isAndroid = navigator.userAgent.match(/Android/i);

export interface HealthData {
  steps: number;
  caloriesBurned: number;
  distance: number;
  heartRate: number;
}

export const useHealthIntegration = () => {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    caloriesBurned: 0,
    distance: 0,
    heartRate: 0,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if health is available
  const isHealthAvailable = useCallback(() => {
    // Check if we're on a mobile device
    if (isIOS) {
      // For iOS, we would check for Apple Health
      return typeof window !== 'undefined' && 'AppleHealthKit' in window;
    } else if (isAndroid) {
      // For Android, we would check for Google Fit
      return typeof window !== 'undefined' && 'GoogleFit' in window;
    }
    return false;
  }, []);

  // Connect to health app
  const connectToHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isIOS) {
        // For iOS devices
        console.log("Connecting to Apple Health...");
        // Here we would use the AppleHealthKit API
        // This is just a mockup since we don't have the actual implementation
        setIsConnected(true);
        // Mock health data
        setHealthData({
          steps: 7500,
          caloriesBurned: 320,
          distance: 5.2,
          heartRate: 72,
        });
        
        toast({
          title: "Success",
          description: "Connected to Apple Health",
        });
      } else if (isAndroid) {
        // For Android devices
        console.log("Connecting to Google Fit...");
        // Here we would use the Google Fit API
        // This is just a mockup since we don't have the actual implementation
        setIsConnected(true);
        // Mock health data
        setHealthData({
          steps: 8200,
          caloriesBurned: 350,
          distance: 6.1,
          heartRate: 68,
        });
        
        toast({
          title: "Success",
          description: "Connected to Google Fit",
        });
      } else {
        // For non-mobile devices or unsupported platforms
        toast({
          variant: "destructive",
          title: "Error",
          description: "Health integration is only available on iOS and Android devices",
        });
      }
    } catch (error) {
      console.error("Error connecting to health app:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to health app. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Disconnect from health app
  const disconnectFromHealth = useCallback(() => {
    setIsConnected(false);
    setHealthData({
      steps: 0,
      caloriesBurned: 0,
      distance: 0,
      heartRate: 0,
    });
    
    toast({
      title: "Disconnected",
      description: "Health app disconnected",
    });
  }, [toast]);

  // Refresh health data
  const refreshHealthData = useCallback(async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      if (isIOS) {
        // For iOS, we would fetch from Apple Health
        console.log("Refreshing data from Apple Health...");
        // Mock updating the data
        setHealthData(prev => ({
          ...prev,
          steps: prev.steps + Math.floor(Math.random() * 1000),
          caloriesBurned: prev.caloriesBurned + Math.floor(Math.random() * 50),
        }));
      } else if (isAndroid) {
        // For Android, we would fetch from Google Fit
        console.log("Refreshing data from Google Fit...");
        // Mock updating the data
        setHealthData(prev => ({
          ...prev,
          steps: prev.steps + Math.floor(Math.random() * 1000),
          caloriesBurned: prev.caloriesBurned + Math.floor(Math.random() * 50),
        }));
      }
    } catch (error) {
      console.error("Error refreshing health data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh health data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  // Initialize health integration if available
  useEffect(() => {
    // Check for stored connection status
    const storedConnectionStatus = localStorage.getItem('healthConnected');
    if (storedConnectionStatus === 'true') {
      // If previously connected, try to reconnect
      setIsConnected(true);
      // Set some initial mock data
      setHealthData({
        steps: 6000 + Math.floor(Math.random() * 4000),
        caloriesBurned: 250 + Math.floor(Math.random() * 150),
        distance: 3 + Math.random() * 5,
        heartRate: 60 + Math.floor(Math.random() * 20),
      });
    }
  }, []);

  // Store connection status when it changes
  useEffect(() => {
    localStorage.setItem('healthConnected', isConnected.toString());
  }, [isConnected]);

  return {
    healthData,
    isConnected,
    isLoading,
    isHealthAvailable,
    connectToHealth,
    disconnectFromHealth,
    refreshHealthData,
  };
};

export default useHealthIntegration;
