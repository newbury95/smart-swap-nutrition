
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/services/FirecrawlService';

interface ApiKeyFormProps {
  onApiKeySave: (apiKey: string) => void;
}

const ApiKeyForm = ({ onApiKeySave }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    FirecrawlService.saveApiKey(apiKey);
    onApiKeySave(apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          Firecrawl API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your Firecrawl API key"
        />
      </div>
      <Button type="submit">Save API Key</Button>
    </form>
  );
};

export const FoodScraper = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());

  const handleScrapeAll = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      console.log('Starting to scrape all UK supermarkets...');
      const foods = await FirecrawlService.crawlWebsite('https://example.com');
      
      setProgress(100);
      toast({
        title: "Success",
        description: `Successfully scraped food items`,
      });

      console.log('Scraped foods:', foods);
      // Here you would typically save the foods to your database
    } catch (error) {
      console.error('Error scraping foods:', error);
      toast({
        title: "Error",
        description: "Failed to scrape supermarket data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Supermarket Data Scraper</h3>
        <ApiKeyForm onApiKeySave={() => setHasApiKey(true)} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Supermarket Data Scraper</h3>
      <div className="space-y-4">
        <Button 
          onClick={handleScrapeAll} 
          disabled={isLoading}
        >
          {isLoading ? "Scraping..." : "Scrape All UK Supermarkets"}
        </Button>
        
        {isLoading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">
              This may take a few minutes...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
