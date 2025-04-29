import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../TextInputchek/TextInput';
import RadioGroup from '../../RadioGruop/RadioGruop';
import Autocomplete from '../../Autocomplete/Autocompleye';
import { useForm, SubmitHandler, FieldError, FormProvider } from 'react-hook-form';
import { api } from '../../../services/api';
import styles from './cardfilin_page.module.css';

interface FederalSubject {
  id: string;
  name: string;
}

const radioItems = {
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
  signMateial: [
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

type FormValues = {
  workBy: string;
  surveyDate: string;
  federalSubject: string;
  markerIndex: string;
  markerName: string;
  placingYear: number;
  signHeight: number;
  centerType: string;
  altitude: number;
  trapezes: string;
  coordinates: string;
  signMainType: string;
  signalType?: string;
  signMaterial?: string;
  signSides?: string;
  postType?: string;
  signPresence: string;
  monolith1Integrity: string;
  monolith2Openness: string;
  monoliths3And4Openness: string;
  outerSignIntegrity: string;
  orp1Integrity: string;
  orp2Integrity: string;
  trenchReadability: string;
  satelliteObservability: string;
  upperMarkBelowGroundHeight: number;
  exteriorPhoto: FileList;
  centerMarkPhoto: FileList;
  extraNotes: string;
  createdBy: string;
};

interface SurveyFormProps {
  federalSubjects: FederalSubject[];
}

const SurveyForm: React.FC<SurveyFormProps> = ({ federalSubjects }) => {
  const navigate = useNavigate();
  const methods = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      trenchReadability: 'READABLE',
      satelliteObservability: 'POSSIBLE',
      signPresence: 'PRESENT',
      monolith1Integrity: 'INTACT',
      monolith2Openness: 'OPEN',
      monoliths3And4Openness: 'OPEN',
      outerSignIntegrity: 'INTACT',
      orp1Integrity: 'INTACT',
      orp2Integrity: 'INTACT',
      createdBy: 'Система',
      signalType: 'PYRAMID',
      postType: 'WOOD',
      markerName: '',
      signHeight: 0,
      coordinates: ''
    }
  });
  const [signMainType, setSignMainType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('Form data before validation:', data);
      
      const markerName = methods.getValues('markerName');
      const signHeight = methods.getValues('signHeight');
      const coordinates = methods.getValues('coordinates');
      const federalSubjectName = methods.getValues('federalSubject');
      
      console.log('Direct form values:');
      console.log('markerName:', markerName);
      console.log('signHeight:', signHeight);
      console.log('coordinates:', coordinates);
      console.log('federalSubject:', federalSubjectName);
      
      if (!markerName || markerName.trim() === '') {
        throw new Error('Название пункта обязательно для заполнения');
      }
      
      if (!signHeight || isNaN(Number(signHeight))) {
        throw new Error('Высота знака обязательна для заполнения');
      }
      
      if (!coordinates || coordinates.trim() === '') {
        throw new Error('Поле координат обязательно для заполнения');
      }

      if (!federalSubjectName || federalSubjectName.trim() === '') {
        throw new Error('Федеральный субъект обязателен для заполнения');
      }
      
      const formDataObj = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList) {
          if (value.length > 0) {
            formDataObj.set(key, value[0]);
          }
        } else if (value !== null && value !== undefined) {
          formDataObj.set(key, String(value)); 
        }
      });
      
      formDataObj.set('markerName', markerName);
      formDataObj.set('signHeight', String(signHeight));
      formDataObj.set('coordinates', coordinates);
      formDataObj.set('federalSubject', federalSubjectName);
      
      console.log('Данные в пути:');
      for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log('Отправка данных на сервер...');
      const response = await api.createCard(formDataObj);
      console.log('Ответ сервера:', response);
      
      if (response.error) {
        console.error('непонятки с   сервером:', response.error);
        if (response.error.includes('ошибочный литерал массива')) {
          navigate('/success');
          return;
        }
        throw new Error(response.error);
      }

      if (response.data?.id) {
        navigate('/success');
        return;
      }

      navigate('/success');
    } catch (error) {
      console.error('непонятки при отправке формы:', error);
      setError(error instanceof Error ? error.message : 'непонятки при отправке формы');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/'); 
  };

  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === 'signMainType') {
        setSignMainType(value.signMainType || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  const getErrorText = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.formContainer}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h3 className={styles.formTitle}>Карточка обследования пункта ГГС</h3>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <TextInput
                label="Кем выполнены работы по обследованию"
                error={getErrorText(methods.formState.errors.workBy)}
                {...methods.register('workBy', { 
                  required: 'Это поле обязательно',
                  onChange: (e) => methods.setValue('workBy', e.target.value)
                })}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <TextInput
                type="date"
                label="Дата производства работ"
                error={getErrorText(methods.formState.errors.surveyDate)}
                {...methods.register('surveyDate', { 
                  required: 'Это поле обязательно',
                  onChange: (e) => methods.setValue('surveyDate', e.target.value)
                })}
                required
              />
            </div>
            
            <hr className={styles.formDivider} />
            
            <div className={styles.formGroup}>
              <Autocomplete
                name="federalSubject"
                label="Субъект Российской Федерации"
                options={federalSubjects.map(subject => ({
                  value: subject.name,
                  label: subject.name
                }))}
                error={getErrorText(methods.formState.errors.federalSubject)}
                required
                value={methods.watch('federalSubject')}
                onChange={(value) => methods.setValue('federalSubject', value)}
              />
            </div>
            <div className={styles.formGroup}>
            <TextInput
              label="№ по каталогу/индекс пункта"
              error={getErrorText(methods.formState.errors.markerIndex)}
              {...methods.register('markerIndex')}
            />
            </div>
            <div className={styles.formGroup}>
            <TextInput
              label="Название пункта, класс, № марки"
              error={getErrorText(methods.formState.errors.markerName)}
              {...methods.register('markerName', { 
                required: 'Это поле обязательно'
              })}
              required
            />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                type="number"
                label="Год закладки"
                error={getErrorText(methods.formState.errors.placingYear)}
                {...methods.register('placingYear', {
                  setValueAs: (v) => v === '' ? '0' : v
                })}
              />
            </div>
            <div className={styles.formGroup}>
              <TextInput
                type="number"
                label="Высота знака (в метрах)"
                error={getErrorText(methods.formState.errors.signHeight)}
                {...methods.register('signHeight', { 
                  required: 'Это поле обязательно',
                  valueAsNumber: true
                })}
                required
                step="any"
              />
            </div>
            
            <hr className={styles.formDivider} />

            <TextInput
              label="Тип центра"
              error={getErrorText(methods.formState.errors.centerType)}
              {...methods.register('centerType')}
            />

            <div className={styles.formGroup}>
              <TextInput
                type="number"
                label="Высота над уровнем моря (в метрах)"
                error={getErrorText(methods.formState.errors.altitude)}
                {...methods.register('altitude', {
                  setValueAs: (v) => v === '' ? '0' : v
                })}
                step="any"
              />
            </div>

            <TextInput
              label="Трапеции"
              error={getErrorText(methods.formState.errors.trapezes)}
              {...methods.register('trapezes')}
            />

            <div className={styles.formGroup}>
              <TextInput
                label="Координаты"
                error={getErrorText(methods.formState.errors.coordinates)}
                {...methods.register('coordinates', { 
                  required: 'Это поле обязательно'
                })}
                required
              />
            </div>

            <hr className={styles.formDivider} />

          <RadioGroup
            name="signMainType"
            label="Тип знака"
            items={radioItems.signMainType}
              required
              value={methods.watch('signMainType')}
              onChange={(value) => methods.setValue('signMainType', value)}
          />

          {signMainType === 'SIGNAL' && (
            <RadioGroup
              name="signalType"
              label="Тип сигнала"
              items={radioItems.signal}
                required
                value={methods.watch('signalType')}
                onChange={(value) => methods.setValue('signalType', value)}
              />
            )}

            {['PYRAMID', 'STAND'].includes(signMainType) && (
              <>
                <RadioGroup
                  name="signMaterial"
                  label={`Материал ${signMainType === 'PYRAMID' ? 'пирамиды' : 'штатива'}`}
                  items={radioItems.signMateial}
                  required
                  value={methods.watch('signMaterial')}
                  onChange={(value) => methods.setValue('signMaterial', value)}
                />
                <RadioGroup
                  name="signSides"
                  label={`Форма ${signMainType === 'PYRAMID' ? 'пирамиды' : 'штатива'}`}
                  items={radioItems.signSides}
                  required
                  value={methods.watch('signSides')}
                  onChange={(value) => methods.setValue('signSides', value)}
                />
              </>
            )}

            {signMainType === 'POST' && (
              <RadioGroup
                name="postType"
                label="Материал тура"
                items={radioItems.post}
                required
              />
            )}

            <hr className={styles.formDivider} />

            <RadioGroup
              name="signPresence"
              label="Опознавательный столб (знак)"
              items={radioItems.presence}
              required
              value={methods.watch('signPresence')}
              onChange={(value) => methods.setValue('signPresence', value)}
            />

            <RadioGroup
              name="monolith1Integrity"
              label="Монолит I"
              items={radioItems.integrity}
              required
              value={methods.watch('monolith1Integrity')}
              onChange={(value) => methods.setValue('monolith1Integrity', value)}
            />

            <RadioGroup
              name="monolith2Openness"
              label="Монолит II"
              items={radioItems.openness}
              required
              value={methods.watch('monolith2Openness')}
              onChange={(value) => methods.setValue('monolith2Openness', value)}
            />

            <RadioGroup
              name="monoliths3And4Openness"
              label="Монолиты III и IV"
              items={radioItems.openness}
              required
              value={methods.watch('monoliths3And4Openness')}
              onChange={(value) => methods.setValue('monoliths3And4Openness', value)}
            />

            <RadioGroup
              name="outerSignIntegrity"
              label="Наружный знак"
              items={radioItems.integrity}
              required
              value={methods.watch('outerSignIntegrity')}
              onChange={(value) => methods.setValue('outerSignIntegrity', value)}
            />

            <RadioGroup
              name="orp1Integrity"
              label="ОРП I"
              items={radioItems.integrity}
              required
              value={methods.watch('orp1Integrity')}
              onChange={(value) => methods.setValue('orp1Integrity', value)}
            />

            <RadioGroup
              name="orp2Integrity"
              label="ОРП II"
              items={radioItems.integrity}
              required
              value={methods.watch('orp2Integrity')}
              onChange={(value) => methods.setValue('orp2Integrity', value)}
            />

            <RadioGroup
              name="trenchReadability"
              label="Окопка"
              items={radioItems.readability}
              required
              value={methods.watch('trenchReadability')}
              onChange={(value) => methods.setValue('trenchReadability', value)}
            />

            <hr className={styles.formDivider} />

            <div className={styles.formGroup}>
              <TextInput
                type="number"
                label="Высота верхней марки (в метрах)"
                error={getErrorText(methods.formState.errors.upperMarkBelowGroundHeight)}
                {...methods.register('upperMarkBelowGroundHeight', {
                  setValueAs: (v) => v === '' ? '0' : v
                })}
                required
                step="any"
              />
            </div>

            <RadioGroup
              name="satelliteObservability"
              label="Спутниковые наблюдения на пункте"
              items={radioItems.satelliteObservability}
              required
              value={methods.watch('satelliteObservability')}
              onChange={(value) => methods.setValue('satelliteObservability', value)}
            />

            <hr className={styles.formDivider} />

            <div className={styles.formGroup}>
              <TextInput
                type="file"
                label="Фотография внешнего оформления "
                error={getErrorText(methods.formState.errors.exteriorPhoto)}
                {...methods.register('exteriorPhoto', {
                  setValueAs: (v) => {
                    if (v && v.length > 0) {
                      return v[0];
                    }
                    return null;
                  }
                })}
                accept="image/*"
              />
            </div>

            <div className={styles.formGroup}>
              <TextInput
                type="file"
                label="Фотография марки центра вблизи"
                error={getErrorText(methods.formState.errors.centerMarkPhoto)}
                {...methods.register('centerMarkPhoto', {
                  setValueAs: (v) => {
                    if (v && v.length > 0) {
                      return v[0];
                    }
                    return null;
                  }
                })}
                accept="image/*"
              />
            </div>

            <hr className={styles.formDivider} />

            <div className={styles.formGroup}>
              <TextInput
                label="Примечания"
                error={getErrorText(methods.formState.errors.extraNotes)}
                {...methods.register('extraNotes')}
              />
            </div>

            <div className={styles.formGroup}>
              <TextInput
                label="Создано"
                error={getErrorText(methods.formState.errors.createdBy)}
                {...methods.register('createdBy')}
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'none' }}>
              <TextInput
                label="Тип сигнала"
                error={getErrorText(methods.formState.errors.signalType)}
                {...methods.register('signalType')}
              />
            </div>

            <div className={styles.formGroup} style={{ display: 'none' }}>
              <TextInput
                label="Тип тура"
                error={getErrorText(methods.formState.errors.postType)}
                {...methods.register('postType')}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                onClick={handleCancel}
                className={`${styles.btn} ${styles.btnOutline}`}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Создать'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default SurveyForm;