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
    
    if (window.ymaps) {
      setYmaps(window.ymaps);
      setIsLoaded(true);
      return;
    }

 
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');

    if (existingScript) {
     
      const checkInterval = setInterval(() => {

        if (window.ymaps) {

          setYmaps(window.ymaps);

          setIsLoaded(true);

          clearInterval(checkInterval);

        }
      }, 100);
      
      return () => clearInterval(checkInterval);
    }

   
    const script = document.createElement('script');

    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=39059dbb-194d-497b-8d8f-0f34cb877191&lang=ru_RU';

    script.async = true;
    
    script.onload = () => {

      if (window.ymaps) {

        window.ymaps.ready(() => {
          setYmaps(window.ymaps);
          
          setIsLoaded(true);
        });
      } else {

        console.error('Ошибка загрузки Яндекс Карт: ymaps не определен после загрузки скрипта');

        setIsLoaded(false);
      }
    };

    script.onerror = (error) => {
      console.error('Ошибка загрузки скрипта Яндекс Карт:', error);
      setIsLoaded(false);
    };

   
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('Invalid API key')) {
        console.error('Ошибка API-ключа Яндекс Карт. Пожалуйста, проверьте ключ в кабинете разработчика.');
        setIsLoaded(false);
      }
    }, true);

    document.head.appendChild(script);

    return () => {
     
      try {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        console.error('Ошибка при удалении скрипта Яндекс Карт:', e);
      }
    };
  }, []);

  return (
    <MapContext.Provider value={{ ymaps, isLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext); 