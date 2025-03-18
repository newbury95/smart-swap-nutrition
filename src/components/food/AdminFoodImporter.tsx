
import { useEffect, useState } from 'react';
import { FoodImporter } from './FoodImporter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw } from 'lucide-react';
import { useFoodImport } from '@/hooks/useFoodImport';
import { fastFoods } from '@/data/food/fast-foods';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const AdminFoodImporter = () => {
  const [showImporter, setShowImporter] = useState(false);
  const [importType, setImportType] = useState<'manual' | 'predefined'>('manual');
  const { importFoods, isImporting } = useFoodImport();
  const { toast } = useToast();
  const [importProgress, setImportProgress] = useState(0);
  const [autoImportComplete, setAutoImportComplete] = useState(false);

  // Auto-import foods on component mount
  useEffect(() => {
    const autoImportFoods = async () => {
      // Check if foods have already been imported
      if (autoImportComplete) return;
      
      try {
        toast({
          title: "Initializing food database",
          description: "Adding UK fast food data to your database. This will only happen once...",
        });
        
        setImportProgress(10);
        
        const result = await importFoods(fastFoods);
        
        setImportProgress(100);
        
        if (result.success) {
          toast({
            title: "Food database ready",
            description: `Successfully added ${result.count} UK fast food items to your database`,
          });
          setAutoImportComplete(true);
        } else {
          toast({
            variant: "destructive",
            title: "Import failed",
            description: result.error || "Failed to initialize food database",
          });
        }
      } catch (error) {
        console.error("Error auto-importing foods:", error);
        toast({
          variant: "destructive",
          title: "Database error",
          description: "Could not add fast food items to database. Please try manual import.",
        });
      }
    };

    // Run the auto-import
    autoImportFoods();
  }, [importFoods, toast, autoImportComplete]);

  const handlePredefinedImport = async () => {
    try {
      toast({
        title: "Starting import",
        description: "Importing predefined food data. This may take a moment...",
      });
      
      setImportProgress(10);
      
      const result = await importFoods(fastFoods);
      
      setImportProgress(100);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.count} food items`,
        });
        setAutoImportComplete(true);
      } else {
        toast({
          variant: "destructive",
          title: "Import failed",
          description: result.error || "Failed to import food data",
        });
      }
    } catch (error) {
      console.error("Error importing predefined foods:", error);
      toast({
        variant: "destructive",
        title: "Import error",
        description: "An unexpected error occurred while importing foods",
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Database Status</CardTitle>
        <CardDescription>
          {autoImportComplete 
            ? "UK fast food database is initialized and ready to use" 
            : "Initializing UK fast food database..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isImporting ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span>Importing UK fast food data...</span>
            </div>
            <Progress value={importProgress} className="h-2" />
          </div>
        ) : autoImportComplete ? (
          <div className="text-center py-4 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Database Ready</h3>
                <p className="text-sm text-green-600">All UK fast food data has been added to your database.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Included Food Chains:</h3>
                <div className="grid grid-cols-2 text-sm text-gray-600">
                  <div className="space-y-1">
                    <p>• McDonald's</p>
                    <p>• KFC</p>
                    <p>• Pizza Hut</p>
                    <p>• Domino's</p>
                    <p>• Burger King</p>
                  </div>
                  <div className="space-y-1">
                    <p>• Nando's</p>
                    <p>• Costa Coffee</p>
                    <p>• Starbucks</p>
                    <p>• Subway</p>
                    <p>• Greggs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <h3 className="font-medium mb-2">Available Food Items</h3>
                  <p className="text-sm text-gray-600">
                    {fastFoods.length} UK fast food items are available in your database
                  </p>
                </div>
                <Button 
                  onClick={handlePredefinedImport} 
                  variant="outline"
                  className="mt-3"
                  size="sm"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Database
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="animate-pulse">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Initializing Food Database</h3>
              <p className="text-muted-foreground mb-4">
                Setting up UK fast food data for your app...
              </p>
              <Progress value={importProgress} className="h-2" />
            </div>
          </div>
        )}
        
        {!isImporting && showImporter && (
          <>
            <div className="my-6 space-y-2">
              <div className="flex space-x-2">
                <Button
                  variant={importType === 'manual' ? "default" : "outline"}
                  onClick={() => setImportType('manual')}
                  className="flex-1"
                >
                  Manual Import
                </Button>
                <Button
                  variant={importType === 'predefined' ? "default" : "outline"}
                  onClick={() => setImportType('predefined')}
                  className="flex-1"
                >
                  Pre-defined Foods
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowImporter(false)}
                size="sm"
                className="w-full"
              >
                Hide Importer
              </Button>
            </div>
            
            {importType === 'manual' ? (
              <FoodImporter />
            ) : (
              <div className="text-center py-6 space-y-4">
                <Button 
                  onClick={handlePredefinedImport} 
                  className="w-full"
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Re-Import All Foods"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
        
        {!showImporter && autoImportComplete && (
          <div className="text-center mt-4">
            <Button onClick={() => setShowImporter(true)} variant="outline" size="sm">
              Show Advanced Options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
