
import { useEffect } from 'react';

interface CriteoAdProps {
  width: number;
  height: number;
  zoneId: string;
  className?: string;
}

export const CriteoAd = ({ width, height, zoneId, className = "" }: CriteoAdProps) => {
  useEffect(() => {
    // Initialize Criteo if not already initialized
    if (!(window as any).Criteo) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//static.criteo.net/js/ld/publishertag.js';
      document.head.appendChild(script);

      script.onload = () => {
        const Criteo = (window as any).Criteo;
        if (Criteo) {
          Criteo.DisplayAd({
            zoneid: zoneId,
            containerid: `criteo-${zoneId}`
          });
        }
      };
    } else {
      const Criteo = (window as any).Criteo;
      Criteo.DisplayAd({
        zoneid: zoneId,
        containerid: `criteo-${zoneId}`
      });
    }
  }, [zoneId]);

  return (
    <div
      id={`criteo-${zoneId}`}
      className={className}
      style={{ width, height }}
    />
  );
};
