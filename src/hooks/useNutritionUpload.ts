
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from './use-toast';

export const useNutritionUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadCSV = async (file: File) => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Error",
        description: "File must be a CSV",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-nutrition-csv', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message || "Failed to upload CSV file",
          variant: "destructive",
        });
        return;
      }

      if (data.error) {
        console.error('Data error:', data.error);
        let errorMessage = data.error;
        if (data.missingColumns) {
          errorMessage = `Missing columns: ${data.missingColumns.join(', ')}\n\nRequired columns: ${data.requiredColumns.join(', ')}\n\nProvided columns: ${data.providedColumns.join(', ')}`;
        } else if (data.errors) {
          errorMessage = data.errors.join('\n');
        }
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${data.rowsProcessed} rows of nutritional data`,
      });

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while uploading the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadCSV,
    isUploading
  };
};
