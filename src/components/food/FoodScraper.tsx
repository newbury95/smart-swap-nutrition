
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { FirecrawlService } from '@/services/FirecrawlService';

export const FoodScraper = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your Firecrawl API key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      FirecrawlService.saveApiKey(apiKey);
      await FirecrawlService.scrapeSupermarket(url);
      
      toast({
        title: "Success",
        description: "Food data scraped successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape food data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Import Supermarket Foods</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Firecrawl API Key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Firecrawl API key"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Supermarket URL
          </label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.supermarket.com/food-section"
          />
        </div>

        {isLoading && (
          <Progress value={progress} />
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Scraping..." : "Start Scraping"}
        </Button>
      </form>
    </Card>
  );
};
