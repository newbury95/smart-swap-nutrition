
import { useState } from "react";
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

// Mock data for the weekly nutrition chart
// In a real application, this would come from the database
const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    calories: Math.floor(Math.random() * 500) + 1500,
    protein: Math.floor(Math.random() * 30) + 70,
    carbs: Math.floor(Math.random() * 50) + 150,
    fats: Math.floor(Math.random() * 20) + 40,
  }));
};

type ChartView = 'calories' | 'macros';

const WeeklyNutritionChart = ({ isPremium }: { isPremium: boolean }) => {
  const [data] = useState(generateWeeklyData());
  const [chartView, setChartView] = useState<ChartView>('calories');

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
          {chartView === 'calories' ? (
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
