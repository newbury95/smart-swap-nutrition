
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFoodImport } from '@/hooks/useFoodImport';
import { Loader2 } from 'lucide-react';

// Food data for import
import { aldiFoods } from '@/data/food/aldi-foods';
import { lidlFoods } from '@/data/food/lidl-foods';
import { asdaFoods } from '@/data/food/asda-foods';
import { sainsburysFoods } from '@/data/food/sainsburys-foods';
import { tescoFoods } from '@/data/food/tesco-foods';
import { marksFoods } from '@/data/food/marks-foods';

export const FoodImporter = () => {
  const { importFoods, isImporting } = useFoodImport();
  const [importStatus, setImportStatus] = useState<Record<string, string>>({});
  
  const foodSources = {
    'Aldi': aldiFoods,
    'Lidl': lidlFoods,
    'Asda': asdaFoods,
    'Sainsburys': sainsburysFoods,
    'Tesco': tescoFoods,
    'M&S': marksFoods,
  };
  
  const handleImport = async (source: string, foods: any[]) => {
    setImportStatus(prev => ({
      ...prev,
      [source]: 'Importing...'
    }));
    
    try {
      const result = await importFoods(foods);
      
      setImportStatus(prev => ({
        ...prev,
        [source]: result.success 
          ? `Success: Imported ${result.count} items` 
          : `Error: ${result.error}`
      }));
    } catch (error) {
      setImportStatus(prev => ({
        ...prev,
        [source]: `Error: ${error.message}`
      }));
    }
  };
  
  const handleImportAll = async () => {
    for (const [source, foods] of Object.entries(foodSources)) {
      await handleImport(source, foods);
    }
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
