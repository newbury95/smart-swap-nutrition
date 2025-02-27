
import { supabase } from "@/hooks/useSupabase";

// Define types for health data
export type HealthData = {
  steps?: number;
  caloriesBurned?: number;
  heartRate?: number;
  exerciseMinutes?: number;
}

export type HealthProvider = 'apple' | 'samsung' | 'manual';

/**
 * Service to handle integration with Apple Health and Samsung Health
 */
class HealthIntegrationService {
  // Check if Apple Health is available on the device
  isAppleHealthAvailable(): boolean {
    // In a real app, we would check if the device supports Apple Health
    // For now, we'll just check if we're on iOS
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  // Check if Samsung Health is available on the device
  isSamsungHealthAvailable(): boolean {
    // In a real app, we would check if the device supports Samsung Health
    // For now, we'll just check if we're on Android
    return /Android/.test(navigator.userAgent);
  }

  // Request permissions for health data access
  async requestPermissions(provider: HealthProvider): Promise<boolean> {
    console.log(`Requesting permissions for ${provider} Health`);
    
    // In a real implementation, we would use the respective SDK to request permissions
    // For this demo, we'll just simulate a successful permission request
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  // Fetch health data from the selected provider
  async fetchHealthData(provider: HealthProvider, date: Date): Promise<HealthData> {
    console.log(`Fetching health data from ${provider} Health for date:`, date);
    
    // In a real implementation, we would fetch actual data from the health provider
    // For this demo, we'll return mock data based on the provider
    let mockData: HealthData = {};
    
    switch (provider) {
      case 'apple':
        mockData = {
          steps: Math.floor(Math.random() * 10000) + 2000,
          caloriesBurned: Math.floor(Math.random() * 500) + 100,
          heartRate: Math.floor(Math.random() * 40) + 60,
          exerciseMinutes: Math.floor(Math.random() * 60) + 15
        };
        break;
      case 'samsung':
        mockData = {
          steps: Math.floor(Math.random() * 8000) + 3000,
          caloriesBurned: Math.floor(Math.random() * 600) + 150,
          heartRate: Math.floor(Math.random() * 30) + 65,
          exerciseMinutes: Math.floor(Math.random() * 45) + 20
        };
        break;
      default:
        mockData = {
          steps: 0,
          caloriesBurned: 0,
          heartRate: 0,
          exerciseMinutes: 0
        };
    }
    
    return mockData;
  }

  // Save health data to the database
  async saveHealthData(userId: string, provider: HealthProvider, data: HealthData, date: Date): Promise<void> {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    const formattedDate = date.toISOString();

    // Save each metric separately
    if (data.steps) {
      await this.saveMetric(userId, 'steps', data.steps, provider, formattedDate);
    }
    
    if (data.caloriesBurned) {
      await this.saveMetric(userId, 'calories_burned', data.caloriesBurned, provider, formattedDate);
    }
    
    if (data.heartRate) {
      await this.saveMetric(userId, 'heart_rate', data.heartRate, provider, formattedDate);
    }
    
    if (data.exerciseMinutes) {
      await this.saveMetric(userId, 'exercise_minutes', data.exerciseMinutes, provider, formattedDate);
    }

    // Save to localStorage for immediate use in the UI
    localStorage.setItem('caloriesBurned', data.caloriesBurned?.toString() || '0');
    localStorage.setItem('steps', data.steps?.toString() || '0');
  }

  // Helper to save a single metric
  private async saveMetric(
    userId: string, 
    metricType: string, 
    value: number, 
    source: HealthProvider,
    recordedAt: string
  ): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
      .from('health_metrics')
      .insert({
        user_id: userId,
        metric_type: metricType,
        value,
        source,
        recorded_at: recordedAt
      });

    if (error) {
      console.error(`Error saving ${metricType} metric:`, error);
    }
  }
}

export const healthIntegrationService = new HealthIntegrationService();
