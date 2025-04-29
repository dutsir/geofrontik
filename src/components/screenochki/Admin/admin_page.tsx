import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './admin_page.module.css';
import { api } from '../../../services/api';

interface SurveyCard {
  id: string;
  markerName: string;
  federalSubject: string;
  markerIndex: string;
  surveyDate: string;
  workBy: string;
  createdBy: string;
}

interface FederalSubject {
  id: string;
  federalDistrictId: number;
  name: string;
  code: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<SurveyCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<SurveyCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  const federalSubjects: FederalSubject[] = [
    { id: '31', federalDistrictId: 1, name: 'Белгородская область', code: '31' },
    { id: '32', federalDistrictId: 1, name: 'Брянская область', code: '32' },
    { id: '33', federalDistrictId: 1, name: 'Владимирская область', code: '33' },
    { id: '36', federalDistrictId: 1, name: 'Воронежская область', code: '36' },
    { id: '37', federalDistrictId: 1, name: 'Ивановская область', code: '37' },
    { id: '40', federalDistrictId: 1, name: 'Калужская область', code: '40' },
    { id: '44', federalDistrictId: 1, name: 'Костромская область', code: '44' },
    { id: '46', federalDistrictId: 1, name: 'Курская область', code: '46' },
    { id: '48', federalDistrictId: 1, name: 'Липецкая область', code: '48' },
    { id: '50', federalDistrictId: 1, name: 'Московская область', code: '50' },
    { id: '57', federalDistrictId: 1, name: 'Орловская область', code: '57' },
    { id: '62', federalDistrictId: 1, name: 'Рязанская область', code: '62' },
    { id: '67', federalDistrictId: 1, name: 'Смоленская область', code: '67' },
    { id: '68', federalDistrictId: 1, name: 'Тамбовская область', code: '68' },
    { id: '69', federalDistrictId: 1, name: 'Тверская область', code: '69' },
    { id: '71', federalDistrictId: 1, name: 'Тульская область', code: '71' },
    { id: '76', federalDistrictId: 1, name: 'Ярославская область', code: '76' },
    { id: '77', federalDistrictId: 1, name: 'г. Москва', code: '77' },
    { id: '10', federalDistrictId: 2, name: 'Республика Карелия', code: '10' },
    { id: '11', federalDistrictId: 2, name: 'Республика Коми', code: '11' },
    { id: '29', federalDistrictId: 2, name: 'Архангельская область', code: '29' },
    { id: '83', federalDistrictId: 2, name: 'Ненецкий автономный округ', code: '83' },
    { id: '35', federalDistrictId: 2, name: 'Вологодская область', code: '35' },
    { id: '39', federalDistrictId: 2, name: 'Калининградская область', code: '39' },
    { id: '47', federalDistrictId: 2, name: 'Ленинградская область', code: '47' },
    { id: '51', federalDistrictId: 2, name: 'Мурманская область', code: '51' },
    { id: '53', federalDistrictId: 2, name: 'Новгородская область', code: '53' },
    { id: '60', federalDistrictId: 2, name: 'Псковская область', code: '60' },
    { id: '78', federalDistrictId: 2, name: 'г. Санкт-Петербург', code: '78' },
    { id: '1', federalDistrictId: 3, name: 'Республика Адыгея', code: '1' },
    { id: '8', federalDistrictId: 3, name: 'Республика Калмыкия', code: '8' },
    { id: '23', federalDistrictId: 3, name: 'Краснодарский край', code: '23' },
    { id: '30', federalDistrictId: 3, name: 'Астраханская область', code: '30' },
    { id: '34', federalDistrictId: 3, name: 'Волгоградская область', code: '34' },
    { id: '61', federalDistrictId: 3, name: 'Ростовская область', code: '61' },
    { id: '5', federalDistrictId: 8, name: 'Республика Дагестан', code: '5' },
    { id: '6', federalDistrictId: 8, name: 'Республика Ингушетия', code: '6' },
    { id: '7', federalDistrictId: 8, name: 'Кабардино-Балкарская Республика', code: '7' },
    { id: '9', federalDistrictId: 8, name: 'Карачаево-Черкесская Республика', code: '9' },
    { id: '15', federalDistrictId: 8, name: 'Республика Северная Осетия-Алания', code: '15' },
    { id: '20', federalDistrictId: 8, name: 'Чеченская Республика', code: '20' },
    { id: '26', federalDistrictId: 8, name: 'Ставропольский край', code: '26' },
    { id: '2', federalDistrictId: 4, name: 'Республика Башкортостан', code: '2' },
    { id: '12', federalDistrictId: 4, name: 'Республика Марий Эл', code: '12' },
    { id: '13', federalDistrictId: 4, name: 'Республика Мордовия', code: '13' },
    { id: '16', federalDistrictId: 4, name: 'Республика Татарстан', code: '16' },
    { id: '18', federalDistrictId: 4, name: 'Удмуртская Республика', code: '18' },
    { id: '21', federalDistrictId: 4, name: 'Чувашская Республика', code: '21' },
    { id: '59', federalDistrictId: 4, name: 'Пермский край', code: '59' },
    { id: '43', federalDistrictId: 4, name: 'Кировская область', code: '43' },
    { id: '52', federalDistrictId: 4, name: 'Нижегородская область', code: '52' },
    { id: '56', federalDistrictId: 4, name: 'Оренбургская область', code: '56' },
    { id: '58', federalDistrictId: 4, name: 'Пензенская область', code: '58' },
    { id: '63', federalDistrictId: 4, name: 'Самарская область', code: '63' },
    { id: '64', federalDistrictId: 4, name: 'Саратовская область', code: '64' },
    { id: '73', federalDistrictId: 4, name: 'Ульяновская область', code: '73' },
    { id: '45', federalDistrictId: 5, name: 'Курганская область', code: '45' },
    { id: '66', federalDistrictId: 5, name: 'Свердловская область', code: '66' },
    { id: '72', federalDistrictId: 5, name: 'Тюменская область', code: '72' },
    { id: '86', federalDistrictId: 5, name: 'Ханты-Мансийский автономный округ', code: '86' },
    { id: '89', federalDistrictId: 5, name: 'Ямало-Ненецкий автономный округ', code: '89' },
    { id: '74', federalDistrictId: 5, name: 'Челябинская область', code: '74' },
    { id: '4', federalDistrictId: 6, name: 'Республика Алтай', code: '4' },
    { id: '3', federalDistrictId: 6, name: 'Республика Бурятия', code: '3' },
    { id: '17', federalDistrictId: 6, name: 'Республика Тыва', code: '17' },
    { id: '19', federalDistrictId: 6, name: 'Республика Хакасия', code: '19' },
    { id: '22', federalDistrictId: 6, name: 'Алтайский край', code: '22' },
    { id: '75', federalDistrictId: 6, name: 'Забайкальский край', code: '75' },
    { id: '24', federalDistrictId: 6, name: 'Красноярский край', code: '24' },
    { id: '38', federalDistrictId: 6, name: 'Иркутская область', code: '38' },
    { id: '42', federalDistrictId: 6, name: 'Кемеровская область', code: '42' },
    { id: '54', federalDistrictId: 6, name: 'Новосибирская область', code: '54' },
    { id: '55', federalDistrictId: 6, name: 'Омская область', code: '55' },
    { id: '70', federalDistrictId: 6, name: 'Томская область', code: '70' },
    { id: '14', federalDistrictId: 7, name: 'Республика Саха (Якутия)', code: '14' },
    { id: '41', federalDistrictId: 7, name: 'Камчатский край', code: '41' },
    { id: '25', federalDistrictId: 7, name: 'Приморский край', code: '25' },
    { id: '27', federalDistrictId: 7, name: 'Хабаровский край', code: '27' },
    { id: '28', federalDistrictId: 7, name: 'Амурская область', code: '28' },
    { id: '49', federalDistrictId: 7, name: 'Магаданская область', code: '49' },
    { id: '65', federalDistrictId: 7, name: 'Сахалинская область', code: '65' },
    { id: '79', federalDistrictId: 7, name: 'Еврейская автономная область', code: '79' },
    { id: '87', federalDistrictId: 7, name: 'Чукотский автономный округ', code: '87' },
    { id: '92', federalDistrictId: 3, name: 'г. Севастополь', code: '92' },
    { id: '91', federalDistrictId: 3, name: 'Республика Крым', code: '91' },
    { id: '99', federalDistrictId: 0, name: 'Иные территории, включая город и космодром Байконур', code: '99' }
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.getSurveys();
        
        if (response.success && response.data) {
          setCards(response.data);
          setFilteredCards(response.data);
        } else {
          setError(response.error || 'непонятки  при загрузке карточек');
          if (response.error === 'No token found') {
            navigate('/login');
          }
        }
      } catch (error) {
        setError('непонятки при подключении к серверу');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [navigate]);

  useEffect(() => {
    let result = cards;

    if (searchTerm) {
      result = result.filter(card => 
        card.markerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.markerIndex.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.federalSubject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      result = result.filter(card => 
        card.federalSubject === selectedSubject
      );
    }

    setFilteredCards(result);
  }, [searchTerm, selectedSubject, cards]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsSelectOpen(!isSelectOpen);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    const selectedValue = event.target.value;
    setSelectedSubject(selectedValue);
    setTimeout(() => {
      setIsSelectOpen(false);
    }, 150);
  };

  const handleSelectBlur = (event: React.FocusEvent<HTMLSelectElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !selectRef.current?.contains(relatedTarget)) {
      setIsSelectOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту карточку?')) {
      try {
        const response = await api.deleteSurvey(id);
        
        if (response.success) {
          setCards(cards.filter(card => card.id !== id));
        } else {
          setError(response.error || 'непонятки при удалении карточки');
          if (response.error === 'No token found') {
            navigate('/login');
          }
        }
      } catch (error) {
        setError('непонятки при подключении к серверу');
      }
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/survey/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Управление карточками обследования</h1>
      
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по названию, индексу или субъекту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterContainer}>
          <select
            ref={selectRef}
            className={`${styles.select} ${isSelectOpen ? styles.open : ''}`}
            value={selectedSubject}
            onChange={handleSelectChange}
            onClick={handleSelectClick}
            onBlur={handleSelectBlur}
            size={isSelectOpen ? 6 : 1}
          >
            <option value="">Все предметы</option>
            {federalSubjects
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {filteredCards.length === 0 ? (
          <div className={styles.noResults}>Карточки не найдены</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Название пункта</th>
                <th>Субъект РФ</th>
                <th>Индекс</th>
                <th>Дата обследования</th>
                <th>Исполнитель</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredCards.map(card => (
                <tr key={card.id}>
                  <td data-label="Название пункта">{card.markerName}</td>
                  <td data-label="Субъект РФ">{card.federalSubject}</td>
                  <td data-label="Индекс">{card.markerIndex}</td>
                  <td data-label="Дата обследования">{new Date(card.surveyDate).toLocaleDateString()}</td>
                  <td data-label="Исполнитель">{card.workBy}</td>
                  <td data-label="Действия">
                    <button
                      onClick={() => handleViewDetails(card.id)}
                      className={styles.viewButton}
                    >
                      Просмотр
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className={styles.deleteButton}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;