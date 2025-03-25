
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CrashReporterProps {
  error: Error;
  componentStack?: string;
  resetError: () => void;
}

const CrashReporter: React.FC<CrashReporterProps> = ({ 
  error, 
  componentStack, 
  resetError 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      // Log to console for development
      console.error('Crash error:', error);
      console.error('Component stack:', componentStack);
      
      // Submit to Supabase
      if (supabase) {
        await supabase
          .from('error_reports')
          .insert([{
            error_message: error.message,
            error_stack: error.stack,
            component_stack: componentStack,
            additional_info: additionalInfo,
            user_id: user?.id || null,
            user_agent: navigator.userAgent,
            url: window.location.href,
          }]);
      }
      
      toast({
        title: "Report sent",
        description: "Thank you for helping us improve the application.",
      });
      
      // Reset the error to recover the app
      resetError();
    } catch (submitError) {
      console.error('Failed to submit error report:', submitError);
      toast({
        variant: "destructive",
        title: "Failed to send report",
        description: "Please try refreshing the page.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        
        <p className="mb-6 text-center text-sm text-gray-600">
          We apologize for the inconvenience. The error has been logged and we'll work to fix it.
        </p>
        
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Error: {error.message}</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="additional-info" className="mb-1 block text-sm font-medium text-gray-700">
            What were you doing when this happened? (Optional)
          </label>
          <Textarea
            id="additional-info"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="I was trying to..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button 
            variant="outline" 
            onClick={resetError}
            className="sm:order-1"
          >
            Reload page
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSending}
            className="bg-red-600 hover:bg-red-700 sm:order-2"
          >
            {isSending ? "Sending report..." : "Send error report"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrashReporter;
