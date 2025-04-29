import React, { useEffect, useState, useRef } from 'react';
import styles from './map_page.module.css';
import { api, SurveyCard } from '../../../services/api';
import { useMap } from '../../../contexts/MapContext';

interface Marker {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
}

interface SurveyCardWithCoordinates extends SurveyCard {
  coordinates: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ymaps, isLoaded } = useMap();
  const mapInitialized = useRef(false);


  useEffect(() => {
    if (!isLoaded || !ymaps || !mapRef.current || mapInitialized.current) return;

    const initMap = () => {
      try {
        ymaps.ready(() => {
          if (!mapRef.current) return;
          
          const newMap = new ymaps.Map(mapRef.current, {
            center: [43.066, 131.926], 
            zoom: 10
          });
          
          setMap(newMap);
          mapInitialized.current = true;
        });
      } catch (error) {
        console.error('ошибочка при иницализейшн', error);
        setError('ошибочка при иницализейшн');
      }
    };

    initMap();

    return () => {
      if (map) {
        try {
          map.destroy();
          mapInitialized.current = false;
        } catch (error) {
          console.error('ошибка при удалениии карточечки', error);
        }
      }
    };
  }, [isLoaded, ymaps]);

  
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.getSurveys();
        
        if (response.success && response.data) {
          const markersData = response.data.map(survey => {
            const surveyWithCoords = survey as unknown as SurveyCardWithCoordinates;
            
           
            if (!surveyWithCoords.coordinates) {
              console.warn(`туты нету координат для ${survey.id}`);
              return null;
            }
            
            try {
              let lat, lng;
              
              if (surveyWithCoords.coordinates.includes('[') && surveyWithCoords.coordinates.includes(']')) {
               
                const coordsStr = surveyWithCoords.coordinates.replace('[', '').replace(']', '');
                const coords = coordsStr.split(',').map(coord => parseFloat(coord.trim()));
                [lat, lng] = coords;
              } else if (surveyWithCoords.coordinates.includes(' ')) {
                
                const coords = surveyWithCoords.coordinates.split(' ').map(coord => parseFloat(coord.trim()));
                [lat, lng] = coords;
              } else if (surveyWithCoords.coordinates.includes(',')) {
              
                const coords = surveyWithCoords.coordinates.split(',').map(coord => parseFloat(coord.trim()));
                [lat, lng] = coords;
              } else {
                
                lat = parseFloat(surveyWithCoords.coordinates);
                lng = 131.926; 
                console.warn(`используется координаты по умолчанию ${survey.id}: ${surveyWithCoords.coordinates}`);
              }
              
             
              if (isNaN(lat) || isNaN(lng)) {
                console.warn(`некорректные координаты для ${survey.id}: ${surveyWithCoords.coordinates}`);
                return null;
              }
              
              return {
                id: survey.id,
                coordinates: [lat, lng] as [number, number],
                title: survey.markerName,
                description: `индекс ${survey.markerIndex}, дата ${survey.surveyDate}`
              };
            } catch (error) {
              console.warn(`ошибочка при обработке координат для ${survey.id}: ${error}`);
              return null;
            }
          }).filter(Boolean) as Marker[]; 
          
          setMarkers(markersData);
        } else {
          setError(response.error || 'непонятки с маркерами');
        }
      } catch (error) {
        console.error('непонятки с маркерами', error);
        setError('непонятки с маркерами');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkers();
  }, []);

 
  useEffect(() => {
    if (!map || !Array.isArray(markers) || markers.length === 0) return;

    try {
     
      map.geoObjects.removeAll();

    
      markers.forEach(marker => {
        try {
          const placemark = new ymaps.Placemark(marker.coordinates, {
            balloonContent: `
              <div>
                <h3>${marker.title}</h3>
                <p>${marker.description}</p>
              </div>
            `
          }, {
            preset: 'islands#blueDotIcon'
          });

          map.geoObjects.add(placemark);
        } catch (error) {
          console.error(`непонятки   при добавлении маркера ${marker.id}:`, error);
        }
      });
    } catch (error) {
      console.error('непонятки при отображении маркеров на карте:', error);
    }
  }, [map, markers, ymaps]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Загрузка карты...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>непонятки с картой</h2>
          <p>{error}</p>
          <p>Если проблема с API-ключом, пожалуйста, проверьте ключ в кабинете разработчика Яндекс.</p>
          <p>Возможные причины:</p>
          <ul>
            <li>API-ключ недействителен или неправильно введен</li>
            <li>API-ключ не имеет разрешений для использования JavaScript API Яндекс Карт</li>
            <li>API-ключ имеет ограничения по домену, и ваш сайт не входит в список разрешенных доменов</li>
            <li>API-ключ не активирован в кабинете разработчика</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>карта геодезических пунктов</h1>
      <div className={styles.mapContainer}>
        <div ref={mapRef} className={styles.map}></div>
      </div>
    </div>
  );
};

export default MapPage;