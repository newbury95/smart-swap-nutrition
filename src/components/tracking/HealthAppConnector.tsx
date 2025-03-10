
import { useState, useEffect } from "react";
import { useHealthIntegration } from "@/hooks/useHealthIntegration";
import { Button } from "@/components/ui/button";
import { Activity, Apple, Smartphone, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const HealthAppConnector = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const {
    connectedProvider,
    availableProviders,
    connectToProvider,
    syncHealthData,
    isLoading,
    healthData
  } = useHealthIntegration();

  const handleConnect = async (provider: 'apple' | 'samsung') => {
    setIsConnecting(true);
    
    try {
      const success = await connectToProvider(provider);
      
      if (success) {
        toast({
          title: "Connected!",
          description: `Successfully connected to ${provider === 'apple' ? 'Apple Health' : 'Samsung Health'}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: `Unable to connect to ${provider === 'apple' ? 'Apple Health' : 'Samsung Health'}. Please try again.`,
        });
      }
    } catch (error) {
      console.error(`Error connecting to ${provider} health:`, error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "An error occurred while trying to connect. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!connectedProvider) {
      toast({
        title: "Not Connected",
        description: "Please connect to a health app first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await syncHealthData();
      
      if (success) {
        toast({
          title: "Synced!",
          description: "Your health data has been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sync Failed",
          description: "Unable to sync health data. Please try again later.",
        });
      }
    } catch (error) {
      console.error('Error syncing health data:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "An error occurred while syncing your health data.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync health data when component mounts if connected
  useEffect(() => {
    if (connectedProvider && !isLoading) {
      syncHealthData().catch(error => {
        console.error('Error auto-syncing health data:', error);
      });
    }
  }, [connectedProvider]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Health App Integration</h2>
        <Activity className="text-green-500 w-5 h-5" />
      </div>
      
      {connectedProvider ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-3 rounded-md flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">
                Connected to {connectedProvider === 'apple' ? 'Apple Health' : 'Samsung Health'}
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing || isLoading}
                className="gap-1"
              >
                {isSyncing ? "Syncing..." : "Sync Now"}
                {isSyncing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
              </Button>
            </div>
            
            {(isSyncing || isLoading) && (
              <Progress value={75} className="h-1 mb-2" />
            )}
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-2 rounded border border-gray-100">
                <span className="text-gray-600 block">Steps</span>
                <span className="font-medium">{healthData?.steps || 0}</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-100">
                <span className="text-gray-600 block">Calories Burned</span>
                <span className="font-medium">{healthData?.caloriesBurned || 0} kcal</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-100">
                <span className="text-gray-600 block">Distance</span>
                <span className="font-medium">{healthData?.distance || 0} km</span>
              </div>
              <div className="bg-white p-2 rounded border border-gray-100">
                <span className="text-gray-600 block">Heart Rate</span>
                <span className="font-medium">{healthData?.heartRate || 0} bpm</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Connect to your health app to automatically sync your activity data.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isConnecting || !availableProviders.apple}
              onClick={() => handleConnect('apple')}
            >
              <Apple className="w-4 h-4" />
              <span>Apple Health</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isConnecting || !availableProviders.samsung}
              onClick={() => handleConnect('samsung')}
            >
              <Smartphone className="w-4 h-4" />
              <span>Samsung Health</span>
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>Available on compatible iOS and Android devices only.</p>
            <p>Make sure you have the health app installed and permissions enabled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAppConnector;
