
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import MacroProgress from "./MacroProgress";
import { Skeleton } from "@/components/ui/skeleton";

interface MacronutrientCardProps {
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  currentMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  macroRatios: {
    protein: number;
    carbs: number;
    fats: number;
  };
  isLoading?: boolean;
}

const MacronutrientCard = ({
  macros,
  currentMacros,
  macroRatios,
  isLoading = false
}: MacronutrientCardProps) => {
  // Validation to prevent NaN or infinity
  const validMacros = {
    protein: isNaN(macros?.protein) ? 0 : macros.protein,
    carbs: isNaN(macros?.carbs) ? 0 : macros.carbs,
    fats: isNaN(macros?.fats) ? 0 : macros.fats,
  };
  
  const validCurrentMacros = {
    protein: isNaN(currentMacros?.protein) ? 0 : currentMacros.protein,
    carbs: isNaN(currentMacros?.carbs) ? 0 : currentMacros.carbs,
    fats: isNaN(currentMacros?.fats) ? 0 : currentMacros.fats,
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Macronutrients Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            {/* Protein progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Protein</span>
                <span>{validCurrentMacros.protein}g / {validMacros.protein}g</span>
              </div>
              <Progress 
                value={(validCurrentMacros.protein / (validMacros.protein || 1)) * 100} 
                indicatorClassName="bg-red-500"
              />
            </div>
            
            {/* Carbs progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Carbs</span>
                <span>{validCurrentMacros.carbs}g / {validMacros.carbs}g</span>
              </div>
              <Progress 
                value={(validCurrentMacros.carbs / (validMacros.carbs || 1)) * 100}
                indicatorClassName="bg-blue-500"
              />
            </div>
            
            {/* Fats progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Fats</span>
                <span>{validCurrentMacros.fats}g / {validMacros.fats}g</span>
              </div>
              <Progress 
                value={(validCurrentMacros.fats / (validMacros.fats || 1)) * 100}
                indicatorClassName="bg-yellow-500"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="space-y-4">
                <MacroProgress
                  label="Protein"
                  color="bg-red-500"
                  percentage={(validCurrentMacros.protein / (validMacros.protein || 1)) * 100}
                  current={validCurrentMacros.protein}
                  target={validMacros.protein}
                  ratio={macroRatios.protein}
                />
                <MacroProgress
                  label="Carbs"
                  color="bg-blue-500"
                  percentage={(validCurrentMacros.carbs / (validMacros.carbs || 1)) * 100}
                  current={validCurrentMacros.carbs}
                  target={validMacros.carbs}
                  ratio={macroRatios.carbs}
                />
                <MacroProgress
                  label="Fats"
                  color="bg-yellow-500"
                  percentage={(validCurrentMacros.fats / (validMacros.fats || 1)) * 100}
                  current={validCurrentMacros.fats}
                  target={validMacros.fats}
                  ratio={macroRatios.fats}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-semibold">{macroRatios.protein}%</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div>
                <div className="font-semibold">{macroRatios.carbs}%</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div>
                <div className="font-semibold">{macroRatios.fats}%</div>
                <div className="text-sm text-muted-foreground">Fats</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MacronutrientCard;
