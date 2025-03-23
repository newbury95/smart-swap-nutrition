
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Crown, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CSVUploader } from "@/components/food/CSVUploader";
import { AdminFoodImporter } from "@/components/food/AdminFoodImporter";

const DatabaseManagementSection = () => {
  const { toast } = useToast();

  const handleImportFoodData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You need to be logged in to perform this action."
        });
        return;
      }
      
      toast({
        title: "Importing Food Data",
        description: "This might take a while. Please wait..."
      });
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-food-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to import data: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error importing food data:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "Failed to import food data. Please try again."
      });
    }
  };

  const handleGoToPremium = () => {
    window.location.href = '/premium';
  };

  return (
    <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Database Management</h2>
        <p className="text-gray-600 mb-6">Import food data into the database or run a test payment.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleImportFoodData}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
          >
            <Database className="w-4 h-4 mr-2" />
            Import UK Fast Food Data
          </Button>
          
          <Button
            onClick={handleGoToPremium}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Test Premium Payment
          </Button>
        </div>
        
        <AdminFoodImporter />
        
        <CSVUploader />
      </CardContent>
    </Card>
  );
};

export default memo(DatabaseManagementSection);
