
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
  const [connectedProvider, setConnectedProvider] = useState<'apple' | 'samsung' | null>(null);
  const [availableProviders, setAvailableProviders] = useState<{
    apple: boolean;
    samsung: boolean;
  }>({
    apple: isIOS ? true : false,
    samsung: isAndroid ? true : false,
  });

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

  // Connect to a specific health provider
  const connectToProvider = useCallback(async (provider: 'apple' | 'samsung'): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (provider === 'apple' && isIOS) {
        console.log("Connecting to Apple Health...");
        // Mock successful connection
        setConnectedProvider('apple');
        setIsConnected(true);
        // Mock health data
        setHealthData({
          steps: 7500,
          caloriesBurned: 320,
          distance: 5.2,
          heartRate: 72,
        });
        return true;
      } else if (provider === 'samsung' && isAndroid) {
        console.log("Connecting to Samsung Health...");
        // Mock successful connection
        setConnectedProvider('samsung');
        setIsConnected(true);
        // Mock health data
        setHealthData({
          steps: 8200,
          caloriesBurned: 350,
          distance: 6.1,
          heartRate: 68,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Health integration for ${provider} is not available on this device`,
        });
        return false;
      }
    } catch (error) {
      console.error(`Error connecting to ${provider} health app:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to connect to ${provider} health app. Please try again.`,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Connect to health app (legacy method)
  const connectToHealth = useCallback(async () => {
    // Determine which provider to connect to based on platform
    const provider = isIOS ? 'apple' : (isAndroid ? 'samsung' : null);
    if (provider) {
      return await connectToProvider(provider);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Health integration is only available on iOS and Android devices",
      });
      return false;
    }
  }, [connectToProvider, toast]);

  // Sync health data from the connected provider
  const syncHealthData = useCallback(async (): Promise<boolean> => {
    if (!connectedProvider) return false;
    
    setIsLoading(true);
    try {
      if (connectedProvider === 'apple') {
        // For iOS, we would fetch from Apple Health
        console.log("Refreshing data from Apple Health...");
        // Mock updating the data
        setHealthData(prev => ({
          ...prev,
          steps: prev.steps + Math.floor(Math.random() * 1000),
          caloriesBurned: prev.caloriesBurned + Math.floor(Math.random() * 50),
        }));
        return true;
      } else if (connectedProvider === 'samsung') {
        // For Android, we would fetch from Samsung Health
        console.log("Refreshing data from Samsung Health...");
        // Mock updating the data
        setHealthData(prev => ({
          ...prev,
          steps: prev.steps + Math.floor(Math.random() * 1000),
          caloriesBurned: prev.caloriesBurned + Math.floor(Math.random() * 50),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing health data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh health data",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [connectedProvider, toast]);

  // Disconnect from health app
  const disconnectFromHealth = useCallback(() => {
    setConnectedProvider(null);
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

  // Refresh health data (legacy method)
  const refreshHealthData = useCallback(async () => {
    return await syncHealthData();
  }, [syncHealthData]);

  // Initialize health integration if available
  useEffect(() => {
    // Check for stored connection status
    const storedConnectionStatus = localStorage.getItem('healthConnected');
    const storedProvider = localStorage.getItem('healthProvider');
    
    if (storedConnectionStatus === 'true' && storedProvider) {
      // If previously connected, try to reconnect
      setIsConnected(true);
      setConnectedProvider(storedProvider as 'apple' | 'samsung');
      
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
    if (connectedProvider) {
      localStorage.setItem('healthProvider', connectedProvider);
    } else {
      localStorage.removeItem('healthProvider');
    }
  }, [isConnected, connectedProvider]);

  return {
    healthData,
    isConnected,
    isLoading,
    connectedProvider,
    availableProviders,
    isHealthAvailable,
    connectToHealth,
    connectToProvider,
    disconnectFromHealth,
    refreshHealthData,
    syncHealthData,
  };
};

export default useHealthIntegration;
