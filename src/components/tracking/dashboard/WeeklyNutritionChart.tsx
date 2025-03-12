
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChartLine, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type NutritionData = {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

type ChartView = 'calories' | 'macros';

const WeeklyNutritionChart = ({ isPremium }: { isPremium: boolean }) => {
  const [data, setData] = useState<NutritionData[]>([]);
  const [chartView, setChartView] = useState<ChartView>('calories');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchWeeklyData() {
      setIsLoading(true);
      try {
        // Get current date and date 7 days ago
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 6); // Get 7 days of data (including today)
        
        // Format dates for the query
        const startDate = weekAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
        
        // Fetch meal data for the date range
        const { data: mealsData, error } = await supabase
          .from('meals')
          .select('date, calories, protein, carbs, fat')
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Process data to aggregate by day
        const dailyTotals = new Map<string, NutritionData>();
        
        // Initialize all dates in the range
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDate = new Date(weekAgo);
        
        while (currentDate <= today) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const dayOfWeek = daysOfWeek[currentDate.getDay()];
          
          dailyTotals.set(dateStr, {
            day: dayOfWeek,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
          });
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Sum up nutrition data for each day
        if (mealsData) {
          mealsData.forEach(meal => {
            const dateStr = meal.date;
            const existingData = dailyTotals.get(dateStr);
            
            if (existingData) {
              dailyTotals.set(dateStr, {
                ...existingData,
                calories: existingData.calories + (meal.calories || 0),
                protein: existingData.protein + (meal.protein || 0),
                carbs: existingData.carbs + (meal.carbs || 0),
                fats: existingData.fats + (meal.fat || 0) // Note the different property name
              });
            }
          });
        }
        
        // Convert the map to an array sorted by date
        const sortedData = Array.from(dailyTotals.entries())
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([_, nutritionData]) => nutritionData);
        
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching weekly nutrition data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load weekly nutrition data",
          description: "Please try again later"
        });
        
        // Provide empty data structure for the chart
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWeeklyData();
  }, [toast]);

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ChartLine className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Weekly Nutrition Progress</h3>
          </div>
          
          <Tabs 
            value={chartView} 
            onValueChange={(v) => setChartView(v as ChartView)}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="calories">Calories</TabsTrigger>
              <TabsTrigger value="macros" disabled={!isPremium}>Macros</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setChartView('calories')}
              className={chartView === 'calories' ? 'bg-primary/10' : ''}
            >
              Calories
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setChartView('macros')}
              disabled={!isPremium}
              className={chartView === 'macros' ? 'bg-primary/10' : ''}
            >
              Macros
            </Button>
          </div>
        </div>
        
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <BarChart2 className="h-16 w-16 animate-pulse text-gray-300" />
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col gap-2">
              <p className="text-gray-500">No nutrition data available for this week</p>
              <p className="text-sm text-gray-400">Log your meals to see your progress</p>
            </div>
          ) : chartView === 'calories' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} kcal`, 'Calories']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="protein" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Protein (g)"
                />
                <Line 
                  type="monotone" 
                  dataKey="carbs" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Carbs (g)"
                />
                <Line 
                  type="monotone" 
                  dataKey="fats" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  name="Fats (g)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {!isPremium && chartView === 'calories' && (
          <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm text-center">
            Upgrade to Premium to view detailed macronutrient tracking over time
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyNutritionChart;
