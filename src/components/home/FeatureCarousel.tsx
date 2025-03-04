
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Food Diary",
    description: "Track your daily meals and nutrition with our comprehensive food diary.",
    image: "/images/diary-preview.jpg",
    path: "/diary"
  },
  {
    title: "Fitness Tracking",
    description: "Monitor your progress with detailed charts and metrics.",
    image: "/images/tracking-preview.jpg",
    path: "/tracking"
  },
  {
    title: "Meal Plans",
    description: "Discover personalized meal plans tailored to your goals.",
    image: "/images/meal-plan-preview.jpg",
    path: "/meal-plans"
  },
  {
    title: "Workout Plans",
    description: "Access expert workout routines for any fitness level.",
    image: "/images/workout-preview.jpg",
    path: "/workout-plans"
  }
];

export function FeatureCarousel() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-between"
                      onClick={() => navigate(feature.path)}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative static mr-2" />
          <CarouselNext className="relative static ml-2" />
        </div>
      </Carousel>
    </div>
  );
}
