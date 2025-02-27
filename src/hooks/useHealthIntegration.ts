
import { useState, useEffect } from 'react';
import { supabase } from './useSupabase';
import { healthIntegrationService, HealthData, HealthProvider } from '@/services/HealthIntegrationService';

export const useHealthIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<HealthData>({});
  const [connectedProvider, setConnectedProvider] = useState<HealthProvider | null>(null);
  
  // Check which health providers are available
  const availableProviders = {
    apple: healthIntegrationService.isAppleHealthAvailable(),
    samsung: healthIntegrationService.isSamsungHealthAvailable()
  };

  // Connect to a health provider
  const connectToProvider = async (provider: HealthProvider) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Request permissions
      const hasPermission = await healthIntegrationService.requestPermissions(provider);
      
      if (!hasPermission) {
        throw new Error(`Permission denied for ${provider} Health`);
      }
      
      // Get user ID from Supabase
      const { data: { user } } = await supabase?.auth.getUser() || { data: { user: null } };
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch initial data
      const today = new Date();
      const data = await healthIntegrationService.fetchHealthData(provider, today);
      
      // Save data to database
      await healthIntegrationService.saveHealthData(user.id, provider, data, today);
      
      // Update state
      setHealthData(data);
      setConnectedProvider(provider);
      
      // Store the connected provider in localStorage for persistence
      localStorage.setItem('healthProvider', provider);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to health provider';
      setError(errorMessage);
      console.error('Health integration error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sync health data (can be called manually or on a schedule)
  const syncHealthData = async () => {
    if (!connectedProvider) {
      setError('No health provider connected');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user ID from Supabase
      const { data: { user } } = await supabase?.auth.getUser() || { data: { user: null } };
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch latest data
      const today = new Date();
      const data = await healthIntegrationService.fetchHealthData(connectedProvider, today);
      
      // Save data to database
      await healthIntegrationService.saveHealthData(user.id, connectedProvider, data, today);
      
      // Update state
      setHealthData(data);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync health data';
      setError(errorMessage);
      console.error('Health data sync error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for previously connected provider on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('healthProvider') as HealthProvider | null;
    if (savedProvider) {
      setConnectedProvider(savedProvider);
      // Optionally sync data on mount
      // syncHealthData();
    }
  }, []);

  return {
    isLoading,
    error,
    healthData,
    connectedProvider,
    availableProviders,
    connectToProvider,
    syncHealthData
  };
};
