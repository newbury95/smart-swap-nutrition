
import React, { useState, useEffect } from 'react';
import { CriteoAd } from '@/components/diary/CriteoAd';

export const AdLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarAdZone, setSidebarAdZone] = useState(() => {
    const savedZone = localStorage.getItem('userAdPreference');
    return savedZone || '1234567'; // Default zone ID
  });

  useEffect(() => {
    localStorage.setItem('userAdPreference', sidebarAdZone);
  }, [sidebarAdZone]);

  return (
    <>
      <div className="container mx-auto px-4 my-4">
        <CriteoAd 
          width={728} 
          height={90} 
          zoneId="847249" // Liverpool FC Campaign Zone ID
          className="mx-auto" 
        />
      </div>

      <div className="grid lg:grid-cols-[300px,1fr,160px] gap-8">
        {children}
        <div className="hidden lg:block">
          <CriteoAd 
            width={160} 
            height={600} 
            zoneId={sidebarAdZone}
            className="sticky top-4" 
          />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <CriteoAd 
          width={728} 
          height={90} 
          zoneId="847250" // TUI Holidays Campaign Zone ID
          className="mx-auto" 
        />
      </div>
    </>
  );
};
