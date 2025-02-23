
import FirecrawlApp, { type FirecrawlDocument } from '@mendable/firecrawl-js';
import { createClient } from '@supabase/supabase-js';
import type { Food, FoodCategory, Supermarket } from '@/components/food/types';

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

  private static UK_SUPERMARKETS = [
    { name: 'Tesco' as Supermarket, url: 'https://www.tesco.com/groceries/' },
    { name: 'Sainsburys' as Supermarket, url: 'https://www.sainsburys.co.uk/shop/gb/groceries' },
    { name: 'Asda' as Supermarket, url: 'https://groceries.asda.com/' },
    { name: 'Morrisons' as Supermarket, url: 'https://groceries.morrisons.com/browse' },
    { name: 'Waitrose' as Supermarket, url: 'https://www.waitrose.com/ecom/shop/browse' }
  ];

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

      // Transform the FirecrawlDocument array into ScrapedFood array
      const scrapedFoods = response.data.map(doc => {
        const extracted = (doc as FirecrawlDocument).selectors as Record<keyof Omit<ScrapedFood, 'supermarket'>, string>;
        return {
          name: extracted.name || '',
          brand: extracted.brand || '',
          calories: extracted.calories || '',
          protein: extracted.protein || '',
          carbs: extracted.carbs || '',
          fat: extracted.fat || '',
          servingSize: extracted.servingSize || '',
          supermarket: new URL(url).hostname.replace('www.', '').split('.')[0]
        };
      });

      // Store the scraped foods in Supabase if available
      const supabaseUrl = (window as any).ENV?.VITE_SUPABASE_URL;
      const supabaseKey = (window as any).ENV?.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const foods = scrapedFoods.map(food => this.transformToFood(food));
        
        const { error } = await supabase
          .from('foods')
          .insert(foods);

        if (error) {
          console.error('Error storing foods in Supabase:', error);
        } else {
          console.log(`Successfully stored ${foods.length} foods in Supabase`);
        }
      }

      console.log(`Scraped ${scrapedFoods.length} foods from ${url}`);
      return scrapedFoods;
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    }
  }

  static transformToFood(scrapedFood: ScrapedFood): Food {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: scrapedFood.name,
      brand: scrapedFood.brand,
      calories: parseInt(scrapedFood.calories) || 0,
      protein: parseInt(scrapedFood.protein) || 0,
      carbs: parseInt(scrapedFood.carbs) || 0,
      fat: parseInt(scrapedFood.fat) || 0,
      servingSize: scrapedFood.servingSize,
      supermarket: scrapedFood.supermarket as Supermarket,
      category: "All Categories" as FoodCategory
    };
  }

  static async scrapeAllUKSupermarkets(): Promise<Food[]> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    let allFoods: Food[] = [];

    for (const supermarket of this.UK_SUPERMARKETS) {
      try {
        console.log(`Starting to scrape ${supermarket.name}...`);
        const scrapedFoods = await this.scrapeSupermarket(supermarket.url);
        const foods = scrapedFoods.map(food => this.transformToFood(food));
        allFoods = [...allFoods, ...foods];
        console.log(`Successfully scraped ${foods.length} items from ${supermarket.name}`);
      } catch (error) {
        console.error(`Error scraping ${supermarket.name}:`, error);
        // Continue with next supermarket even if one fails
        continue;
      }
    }

    return allFoods;
  }
}
