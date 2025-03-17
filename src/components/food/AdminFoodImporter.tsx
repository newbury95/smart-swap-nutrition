
import { FoodImporter } from './FoodImporter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database } from '@/components/ui/database';

export const AdminFoodImporter = () => {
  const [showImporter, setShowImporter] = useState(false);
  
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
          <FoodImporter />
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
