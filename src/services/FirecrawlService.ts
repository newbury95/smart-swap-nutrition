
import FirecrawlApp from '@mendable/firecrawl-js';

interface ScrapedFood {
  name: string;
  brand: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servingSize: string;
  supermarket: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async scrapeSupermarket(url: string): Promise<ScrapedFood[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    if (!this.firecrawlApp) {
      this.firecrawlApp = new FirecrawlApp({ apiKey });
    }

    try {
      const response = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          selectors: {
            name: '.product-name',
            brand: '.brand-name',
            calories: '.nutrition-calories',
            protein: '.nutrition-protein',
            carbs: '.nutrition-carbs',
            fat: '.nutrition-fat',
            servingSize: '.serving-size'
          }
        }
      });

      if (!response.success) {
        throw new Error('Failed to scrape website');
      }

      return response.data as ScrapedFood[];
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    }
  }
}
