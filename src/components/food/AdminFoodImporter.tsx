
import { useState } from 'react';
import { FoodImporter } from './FoodImporter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import { useFoodImport } from '@/hooks/useFoodImport';
import { fastFoods } from '@/data/food/fast-foods';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AdminFoodImporter = () => {
  const [showImporter, setShowImporter] = useState(false);
  const [importType, setImportType] = useState<'manual' | 'predefined'>('manual');
  const { importFoods, isImporting } = useFoodImport();
  const { toast } = useToast();

  const handlePredefinedImport = async () => {
    try {
      toast({
        title: "Starting import",
        description: "Importing predefined food data. This may take a moment...",
      });
      
      const result = await importFoods(fastFoods);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.count} food items`,
        });
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
        <CardTitle>Food Database Admin</CardTitle>
        <CardDescription>
          Import food data from supermarkets and fast food chains into the central database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showImporter ? (
          <>
            <div className="mb-6 space-y-2">
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
                <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
                  <h3 className="font-medium mb-2">Included Food Data:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• McDonald's (full menu)</li>
                    <li>• KFC (most popular items)</li>
                    <li>• Pizza Hut (popular pizzas and sides)</li>
                    <li>• Domino's (popular pizzas and sides)</li>
                    <li>• Burger King (burgers and popular items)</li>
                    <li>• Nando's (chicken items and sides)</li>
                    <li>• Costa Coffee (drinks and snacks)</li>
                    <li>• Starbucks (popular drinks)</li>
                    <li>• Subway (popular subs)</li>
                    <li>• Greggs (pastries and sandwiches)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  This will import approximately {fastFoods.length} food items to your database.
                </p>
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
                    "Import All Pre-defined Foods"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Import Food Database</h3>
            <p className="text-muted-foreground mb-4">
              Import food data from supermarkets (Aldi, Lidl, Asda, Sainsbury's, Tesco, M&S) 
              and fast food chains (McDonald's, KFC, Burger King, Pizza Hut, Dominos, Nandos, 
              Costa Coffee, Starbucks, Subway, Greggs, and more).
            </p>
            <Button onClick={() => setShowImporter(true)}>
              Show Importer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
