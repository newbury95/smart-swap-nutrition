
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AuthContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  onBackToHome: () => void;
}

export const AuthContainer = ({ 
  title, 
  description, 
  children, 
  onBackToHome
}: AuthContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white py-12">
      <div className="container max-w-md mx-auto px-4">
        <Button 
          onClick={onBackToHome}
          variant="ghost"
          className="mb-6"
        >
          Back to Home
        </Button>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-center">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
