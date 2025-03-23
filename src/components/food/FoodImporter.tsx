
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFoodImport } from '@/hooks/useFoodImport';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Food data for import
import { aldiFoods } from '@/data/food/aldi-foods';
import { lidlFoods } from '@/data/food/lidl-foods';
import { asdaFoods } from '@/data/food/asda-foods';
import { sainsburysFoods } from '@/data/food/sainsburys-foods';
import { tescoFoods } from '@/data/food/tesco-foods';
import { marksFoods } from '@/data/food/marks-foods';
import { mcdonaldsFoods } from '@/data/food/mcdonalds-foods';
import { pizzaHutFoods } from '@/data/food/pizzahut-foods';
import { dominosFoods } from '@/data/food/dominos-foods';
import { kfcFoods } from '@/data/food/kfc-foods';
import { nandosFoods } from '@/data/food/nandos-foods';
import { burgerKingFoods } from '@/data/food/burger-king-foods';
import { costaCoffeeFoods } from '@/data/food/costa-foods';
import { starbucksFoods } from '@/data/food/starbucks-foods';
import { subwayFoods } from '@/data/food/subway-foods';
import { greggsFoods } from '@/data/food/greggs-foods';
import { dunkinFoods } from '@/data/food/dunkin-foods';
import { barBurritoFoods } from '@/data/food/barburrito-foods';
import { chopsticksNoodleBarFoods } from '@/data/food/chopsticks-foods';

export const FoodImporter = () => {
  const { importFoods, isImporting } = useFoodImport();
  const [importStatus, setImportStatus] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const foodSources = {
    // Supermarkets
    'Aldi': aldiFoods,
    'Lidl': lidlFoods,
    'Asda': asdaFoods,
    'Sainsburys': sainsburysFoods,
    'Tesco': tescoFoods,
    'M&S': marksFoods,
    // Fast Food Chains
    'McDonalds': mcdonaldsFoods,
    'Pizza Hut': pizzaHutFoods,
    'Dominos': dominosFoods,
    'KFC': kfcFoods,
    'Nandos': nandosFoods,
    'Burger King': burgerKingFoods,
    'Costa Coffee': costaCoffeeFoods,
    'Starbucks': starbucksFoods,
    'Subway': subwayFoods,
    'Greggs': greggsFoods,
    'Dunkin': dunkinFoods,
    'Bar Burrito': barBurritoFoods,
    'Chopsticks Noodle Bar': chopsticksNoodleBarFoods
  };
  
  const handleImport = async (source: string, foods: any[]) => {
    if (isImporting) {
      toast({
        title: "Import in progress",
        description: "Please wait for the current import to complete",
      });
      return;
    }
    
    try {
      setImportStatus(prev => ({
        ...prev,
        [source]: 'Importing...'
      }));
      
      console.log(`Starting import for ${source} with ${foods.length} items`);
      const result = await importFoods(foods);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Imported ${result.count} items from ${source}`,
        });
        
        setImportStatus(prev => ({
          ...prev,
          [source]: `Success: Imported ${result.count} items`
        }));
      } else {
        console.error(`Import failed for ${source}:`, result.error);
        toast({
          variant: "destructive",
          title: "Import failed",
          description: result.error || `Failed to import data from ${source}`,
        });
        
        setImportStatus(prev => ({
          ...prev,
          [source]: `Error: ${result.error || 'Unknown error'}`
        }));
      }
    } catch (error: any) {
      console.error(`Unexpected error importing from ${source}:`, error);
      setImportStatus(prev => ({
        ...prev,
        [source]: `Error: ${error.message || 'Unexpected error'}`
      }));
      
      toast({
        variant: "destructive",
        title: "Import error",
        description: error.message || `Failed to import data from ${source}`,
      });
    }
  };
  
  const handleImportAll = async () => {
    if (isImporting) {
      toast({
        title: "Import in progress",
        description: "Please wait for the current import to complete",
      });
      return;
    }
    
    toast({
      title: "Starting batch import",
      description: "Importing food data from all sources",
    });
    
    for (const [source, foods] of Object.entries(foodSources)) {
      await handleImport(source, foods);
    }
    
    toast({
      title: "Batch import complete",
      description: "All food data sources have been processed",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Database Importer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Import All Food Data</h3>
            <Button 
              onClick={handleImportAll} 
              disabled={isImporting}
            >
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Import All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(foodSources).map(([source, foods]) => (
              <Card key={source} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md">{source}</CardTitle>
                    <div className="text-sm text-gray-500">{foods.length} items</div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {importStatus[source] || 'Ready to import'}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleImport(source, foods)}
                      disabled={isImporting || importStatus[source]?.startsWith('Success')}
                    >
                      {isImporting && importStatus[source] === 'Importing...' && 
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
