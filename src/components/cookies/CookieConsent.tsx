
import React, { useEffect, useState } from "react";
import { X, Cookie } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CookiePreference {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "nutritrack-cookie-consent";

export const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreference>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!savedConsent) {
      // Show the consent popup if no saved preferences
      setOpen(true);
    } else {
      // Load the saved preferences
      setPreferences(JSON.parse(savedConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    setOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setOpen(false);
  };

  const togglePreference = (key: keyof CookiePreference) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies
    
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Show cookie settings button if consent previously given
  const showCookieSettings = () => {
    setOpen(true);
  };

  return (
    <>
      {/* Cookie Settings trigger button - only show if previously consented */}
      {localStorage.getItem(COOKIE_CONSENT_KEY) && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border-gray-300 bg-background/80 backdrop-blur-sm"
          onClick={showCookieSettings}
        >
          <Cookie className="h-4 w-4" />
          Cookie Settings
        </Button>
      )}

      {/* Cookie consent dialog */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          side="bottom" 
          className="sm:max-w-full relative cookie-consent-sheet"
        >
          {/* Style to hide the default close button */}
          <style dangerouslySetInnerHTML={{
            __html: `.cookie-consent-sheet .radix-dialog-close { display: none; }`
          }} />
          
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </SheetTitle>
            <SheetDescription>
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              Please select which cookies you consent to.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-2 space-y-4">
            <div className="flex items-start space-x-3 pt-1">
              <Checkbox id="necessary" checked disabled />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="necessary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Necessary Cookies
                </label>
                <p className="text-sm text-gray-500">
                  These cookies are required for the website to function properly and cannot be disabled.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-1">
              <Checkbox 
                id="analytics" 
                checked={preferences.analytics}
                onCheckedChange={() => togglePreference("analytics")} 
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="analytics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Analytics Cookies
                </label>
                <p className="text-sm text-gray-500">
                  These cookies help us understand how visitors interact with our website and help us improve its functionality.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-1">
              <Checkbox 
                id="marketing" 
                checked={preferences.marketing}
                onCheckedChange={() => togglePreference("marketing")} 
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="marketing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Marketing Cookies
                </label>
                <p className="text-sm text-gray-500">
                  These cookies track your online activity to help advertisers deliver more relevant advertising.
                </p>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Reject All
            </Button>
            <Button variant="outline" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
            <Button onClick={handleAcceptAll}>
              Accept All
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CookieConsent;
