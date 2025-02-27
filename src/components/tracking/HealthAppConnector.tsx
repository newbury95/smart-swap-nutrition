
import { useState } from "react";
import { useHealthIntegration } from "@/hooks/useHealthIntegration";
import { Button } from "@/components/ui/button";
import { Activity, Apple, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

const HealthAppConnector = () => {
  const { toast } = useToast();
  const { isPremium } = usePremiumStatus();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const {
    connectedProvider,
    availableProviders,
    connectToProvider,
    syncHealthData,
    isLoading,
    healthData
  } = useHealthIntegration();

  const handleConnect = async (provider: 'apple' | 'samsung') => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Health app integration is available for premium users only.",
        variant: "destructive"
      });
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const success = await connectToProvider(provider);
      
      if (success) {
        toast({
          title: "Connected!",
          description: `Successfully connected to ${provider === 'apple' ? 'Apple Health' : 'Samsung Health'}.`,
        });
      }
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
    
    const success = await syncHealthData();
    
    if (success) {
      toast({
        title: "Synced!",
        description: "Your health data has been updated.",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Health App Integration</h2>
        <Activity className="text-green-500 w-5 h-5" />
      </div>
      
      {connectedProvider ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-3 rounded-md flex items-center justify-between">
            <div>
              <p className="font-medium">
                Connected to {connectedProvider === 'apple' ? 'Apple Health' : 'Samsung Health'}
              </p>
              {healthData && (
                <p className="text-sm text-gray-500">
                  Last sync: {healthData.steps ? `${healthData.steps} steps` : 'No data'}
                </p>
              )}
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSync}
              disabled={isLoading}
            >
              {isLoading ? "Syncing..." : "Sync Now"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Connect to your health app to automatically sync your activity data.
            {!isPremium && " (Premium feature)"}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isConnecting || !availableProviders.apple || !isPremium}
              onClick={() => handleConnect('apple')}
            >
              <Apple className="w-4 h-4" />
              <span>Apple Health</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              disabled={isConnecting || !availableProviders.samsung || !isPremium}
              onClick={() => handleConnect('samsung')}
            >
              <Smartphone className="w-4 h-4" />
              <span>Samsung Health</span>
            </Button>
          </div>
          
          {!isPremium && (
            <p className="text-xs text-amber-600 italic">
              Health app integration is available for premium users only.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthAppConnector;
