import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import styles from './card_view_page.module.css';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';


const valueTranslations = {
  signMainType: [
    { value: 'SIGNAL', label: 'Сигнал' },
    { value: 'CENTER', label: 'Центр' },
    { value: 'GROUND', label: 'Грунтовый' },
    { value: 'PYRAMID', label: 'Пирамида' },
    { value: 'STAND', label: 'Штатив' },
    { value: 'POST', label: 'Тур' }
  ],
  signal: [
    { value: 'PYRAMID', label: 'Пирамида' },
    { value: 'TOWER', label: 'Башня' },
    { value: 'POLE', label: 'Столб' }
  ],
  signMaterial: [
    { value: 'WOOD', label: 'Дерево' },
    { value: 'METAL', label: 'Металл' },
    { value: 'CONCRETE', label: 'Бетон' }
  ],
  signSides: [
    { value: 'TRIANGLE', label: 'Треугольная' },
    { value: 'SQUARE', label: 'Квадратная' },
    { value: 'ROUND', label: 'Круглая' }
  ],
  post: [
    { value: 'WOOD', label: 'Деревянный' },
    { value: 'METAL', label: 'Металлический' },
    { value: 'CONCRETE', label: 'Бетонный' }
  ],
  presence: [
    { value: 'PRESENT', label: 'Присутствует' },
    { value: 'ABSENT', label: 'Отсутствует' }
  ],
  integrity: [
    { value: 'INTACT', label: 'Целостность не нарушена' },
    { value: 'DAMAGED', label: 'Целостность нарушена' }
  ],
  openness: [
    { value: 'OPEN', label: 'Открыт' },
    { value: 'CLOSED', label: 'Закрыт' }
  ],
  readability: [
    { value: 'READABLE', label: 'Читаема' },
    { value: 'UNREADABLE', label: 'Не читаема' }
  ],
  satelliteObservability: [
    { value: 'POSSIBLE', label: 'Возможны' },
    { value: 'IMPOSSIBLE', label: 'Невозможны' }
  ]
};

const translateValue = (value: string, type: keyof typeof valueTranslations): string => {
  const translations = valueTranslations[type];
  const translation = translations?.find(item => item.value === value);
  return translation?.label || value;
};

const CardViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});


  const getProxyImageUrl = (originalUrl: string) => {
    if (originalUrl.includes('/proxy/image')) {
      return originalUrl;
    }
    const encodedUrl = encodeURIComponent(originalUrl);
    return `http://localhost:5000/proxy/image?url=${encodedUrl}`;
  };

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getSurvey(id || '');
        
        if (response.success && response.data) {
          console.log('Полученные данные карточки:', response.data);
          if (response.data.images) {
            response.data.images = response.data.images.map((url: string) => getProxyImageUrl(url));
            console.log('Прокси-URL изображений:', response.data.images);
          }
          setCard(response.data);
        } else {
          setError(response.error || 'Ошибка при загрузке карточки');
        }
      } catch (error) {
        console.error('Ошибка при загрузке карточки:', error);
        setError('Ошибка при подключении к серверу');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    }
  }, [id]);

  const handleImageError = (imageUrl: string, event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Ошибка загрузки изображения:', {
      url: imageUrl,
      error: event,
      timestamp: new Date().toISOString()
    });
    setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
  };

  const exportToWord = async () => {
    if (!card) return;


    const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]); 
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        return '';
      }
    };


    const imagePromises = card.images?.map((url: string) => getImageAsBase64(url)) || [];
    const imageBase64Array = await Promise.all(imagePromises);

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Карточка обследования пункта ГГС",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({}),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 30,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({ children: [new TextRun({ text: "Название маркера:", bold: true })] })],
                  }),
                  new TableCell({
                    width: {
                      size: 70,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({ children: [new TextRun({ text: card.markerName })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Федеральный субъект:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.federalSubject })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Индекс маркера:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.markerIndex })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Дата обследования:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.surveyDate })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Работа выполнена:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.workBy })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Создано:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.createdBy })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Год установки:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.placingYear?.toString() || '' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Высота знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.signHeight?.toString() || '' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Тип центра:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.centerType, 'signMainType') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Высота над уровнем моря:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.altitude?.toString() || '' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Трапеции:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.trapezes })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Координаты:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.coordinates })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Тип знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.signMainType, 'signMainType') })] })],
                  }),
                ],
              }),
              card.signalType && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Тип сигнала:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.signalType, 'signal') })] })],
                  }),
                ],
              }),
              card.signMaterial && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Материал знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.signMaterial, 'signMaterial') })] })],
                  }),
                ],
              }),
              card.signSides && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Форма знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.signSides, 'signSides') })] })],
                  }),
                ],
              }),
              card.postType && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Тип тура:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.postType, 'post') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Наличие знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.signPresence, 'presence') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Целостность монолита 1:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.monolith1Integrity, 'integrity') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Открытость монолита 2:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.monolith2Openness, 'openness') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Открытость монолитов 3 и 4:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.monoliths3And4Openness, 'openness') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Целостность наружного знака:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.outerSignIntegrity, 'integrity') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Целостность ОРП 1:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.orp1Integrity, 'integrity') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Целостность ОРП 2:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.orp2Integrity, 'integrity') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Читаемость надписи в траншее:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.trenchReadability, 'readability') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Возможность спутниковых наблюдений:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: translateValue(card.satelliteObservability, 'satelliteObservability') })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Высота верхней марки ниже уровня земли:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.upperMarkBelowGroundHeight?.toString() || '' })] })],
                  }),
                ],
              }),
              card.extraNotes && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Дополнительные заметки:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.extraNotes })] })],
                  }),
                ],
              }),
              card.status && new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Статус:", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: card.status })] })],
                  }),
                ],
              }),
            ].filter(Boolean),
          }),
          new Paragraph({}),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Фотографии",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({}),
          ...imageBase64Array.map((base64, index) => [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Фотография ${index + 1}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: base64,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                  type: 'png',
                }),
              ],
              spacing: {
                after: 400,
              },
            }),
          ]).flat(),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Карточка_${card.markerName}_${card.markerIndex}.docx`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!card) {
    return <div>Карточка не найдена</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Просмотр карточки</h1>
      <div className={styles.card}>
        {/* Блок основной информации */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Основная информация</div>
          <div className={styles.field}>
            <label>Название маркера:</label>
            <span>{card.markerName}</span>
          </div>
          <div className={styles.field}>
            <label>Федеральный субъект:</label>
            <span>{card.federalSubject}</span>
          </div>
          <div className={styles.field}>
            <label>Индекс маркера:</label>
            <span>{card.markerIndex}</span>
          </div>
        </div>

        {/* Блок дат и исполнителей */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Даты и исполнители</div>
          <div className={styles.field}>
            <label>Дата обследования:</label>
            <span>{card.surveyDate}</span>
          </div>
          <div className={styles.field}>
            <label>Работа выполнена:</label>
            <span>{card.workBy}</span>
          </div>
          <div className={styles.field}>
            <label>Создано:</label>
            <span>{card.createdBy}</span>
          </div>
        </div>

        {/* Блок характеристик знака */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Характеристики знака</div>
          <div className={styles.field}>
            <label>Год установки:</label>
            <span>{card.placingYear}</span>
          </div>
          <div className={styles.field}>
            <label>Высота знака:</label>
            <span>{card.signHeight}</span>
          </div>
          <div className={styles.field}>
            <label>Тип центра:</label>
            <span>{translateValue(card.centerType, 'signMainType')}</span>
          </div>
        </div>

        {/* Блок координат */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Координаты и местоположение</div>
          <div className={styles.field}>
            <label>Высота над уровнем моря:</label>
            <span>{card.altitude}</span>
          </div>
          <div className={styles.field}>
            <label>Трапеции:</label>
            <span>{card.trapezes}</span>
          </div>
          <div className={styles.field}>
            <label>Координаты:</label>
            <span>{card.coordinates}</span>
          </div>
        </div>

        {/* Блок типа и материала */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Тип и материал</div>
          <div className={styles.field}>
            <label>Тип знака:</label>
            <span>{translateValue(card.signMainType, 'signMainType')}</span>
          </div>
          {card.signalType && (
            <div className={styles.field}>
              <label>Тип сигнала:</label>
              <span>{translateValue(card.signalType, 'signal')}</span>
            </div>
          )}
          {card.signMaterial && (
            <div className={styles.field}>
              <label>Материал знака:</label>
              <span>{translateValue(card.signMaterial, 'signMaterial')}</span>
            </div>
          )}
          {card.signSides && (
            <div className={styles.field}>
              <label>Форма знака:</label>
              <span>{translateValue(card.signSides, 'signSides')}</span>
            </div>
          )}
          {card.postType && (
            <div className={styles.field}>
              <label>Тип тура:</label>
              <span>{translateValue(card.postType, 'post')}</span>
            </div>
          )}
        </div>

        {/* Блок состояния */}
        <div className={styles.infoBlock}>
          <div className={styles.infoBlockTitle}>Состояние</div>
          <div className={styles.field}>
            <label>Наличие знака:</label>
            <span>{translateValue(card.signPresence, 'presence')}</span>
          </div>
          <div className={styles.field}>
            <label>Целостность монолита 1:</label>
            <span>{translateValue(card.monolith1Integrity, 'integrity')}</span>
          </div>
          <div className={styles.field}>
            <label>Открытость монолита 2:</label>
            <span>{translateValue(card.monolith2Openness, 'openness')}</span>
          </div>
          <div className={styles.field}>
            <label>Открытость монолитов 3 и 4:</label>
            <span>{translateValue(card.monoliths3And4Openness, 'openness')}</span>
          </div>
          <div className={styles.field}>
            <label>Целостность наружного знака:</label>
            <span>{translateValue(card.outerSignIntegrity, 'integrity')}</span>
          </div>
          <div className={styles.field}>
            <label>Целостность ОРП 1:</label>
            <span>{translateValue(card.orp1Integrity, 'integrity')}</span>
          </div>
          <div className={styles.field}>
            <label>Целостность ОРП 2:</label>
            <span>{translateValue(card.orp2Integrity, 'integrity')}</span>
          </div>
          <div className={styles.field}>
            <label>Читаемость надписи в траншее:</label>
            <span>{translateValue(card.trenchReadability, 'readability')}</span>
          </div>
          <div className={styles.field}>
            <label>Возможность спутниковых наблюдений:</label>
            <span>{translateValue(card.satelliteObservability, 'satelliteObservability')}</span>
          </div>
          <div className={styles.field}>
            <label>Высота верхней марки ниже уровня земли:</label>
            <span>{card.upperMarkBelowGroundHeight}</span>
          </div>
        </div>

        {/* Блок дополнительной информации */}
        {(card.extraNotes || card.status) && (
          <div className={styles.infoBlock}>
            <div className={styles.infoBlockTitle}>Дополнительная информация</div>
            {card.extraNotes && (
              <div className={styles.field}>
                <label>Дополнительные заметки:</label>
                <span>{card.extraNotes}</span>
              </div>
            )}
            {card.status && (
              <div className={styles.field}>
                <label>Статус:</label>
                <span>{card.status}</span>
              </div>
            )}
          </div>
        )}

        {/* Блок фотографий */}
        {card.images && card.images.length > 0 && (
          <div className={styles.infoBlock}>
            <div className={styles.infoBlockTitle}>Фотографии</div>
            <div className={styles.images}>
              {card.images.map((imageUrl: string, index: number) => (
                <div key={index} className={styles.imageContainer}>
                  {!imageErrors[imageUrl] ? (
                    <img 
                      src={imageUrl} 
                      alt={`Фото ${index + 1}`} 
                      className={styles.image}
                      onError={(e) => handleImageError(imageUrl, e)}
                    />
                  ) : (
                    <div className={styles.imageError}>
                      <span className={styles.errorIcon}>⚠️</span>
                      <span>Ошибка загрузки</span>
                      <span className={styles.errorDetails}>URL: {imageUrl}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={exportToWord} className={styles.exportButton}>
          Экспорт в Word
        </button>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Назад
        </button>
      </div>
    </div>
  );
};

export default CardViewPage; 