import React, { createContext, useContext, useState, useEffect } from 'react';

interface MapContextType {
  ymaps: any;
  isLoaded: boolean;
}

const MapContext = createContext<MapContextType>({
  ymaps: null,
  isLoaded: false
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ymaps, setYmaps] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadYmaps = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          setYmaps(window.ymaps);
          setIsLoaded(true);
          console.log('Яндекс карты загрузились, ура! ');
        });
      } else {
        console.log(' что-то пошло не так с картами ');
      }
    };

    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=39059dbb-194d-497b-8d8f-0f34cb877191&lang=ru_RU';
      script.async = true;
      script.onload = loadYmaps;
      script.onerror = () => {
        console.log('Не удалось загрузить карты, печалька ');
        setIsLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      loadYmaps();
    }

    return () => {
      if (window.ymaps) {
        window.ymaps = null;
      }
    };
  }, []);

  return (
    <MapContext.Provider value={{ ymaps, isLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error(' что-то не так с картами! ');
  }
  return context;
}; 