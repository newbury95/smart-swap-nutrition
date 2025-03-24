
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { useNutritionUpload } from '@/hooks/useNutritionUpload';
import { Skeleton } from '@/components/ui/skeleton';

export const CSVUploader = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { uploadCSV, isUploading } = useNutritionUpload();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!csvFile) return;
    await uploadCSV(csvFile);
    setCsvFile(null);
    
    // Reset the file input
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>CSV Nutrition Data Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="csv-file" className="text-sm font-medium text-gray-700">
                Select CSV File
              </label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file:bg-green-500 file:text-white file:hover:bg-green-600 file:transition-colors file:border-0 file:px-3 file:py-2 file:mr-3 file:rounded"
              />
              <p className="text-xs text-gray-500">
                CSV must contain columns: name, calories, protein, carbs, fat, servingSize, supermarket
              </p>
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!csvFile || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
