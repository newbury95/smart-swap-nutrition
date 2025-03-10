
import { FoodImporter } from './FoodImporter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminFoodImporter = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Database Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <FoodImporter />
      </CardContent>
    </Card>
  );
};
