import React from 'react';
import styles from './InfoPage.module.css';

const InfoPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Информация о геодезических знаках и пунктах</h1>

      <section className={styles.introSection}>
        <h2 className={styles.sectionTitle}>Геодезический знак</h2>
        <p className={styles.paragraph}>
          Геодезический знак — это наземное сооружение или устройство,
          которое устанавливается над геодезическим пунктом и служит для
          обозначения его местоположения, обеспечения долговременной
          сохранности центра пункта и создания условий для производства
          геодезических измерений (например, для установки приборов или
          визирования). Эти знаки являются ключевыми элементами
          государственной геодезической сети (ГГС) и играют важную роль в
          различных сферах деятельности, включая картографию, строительство,
          кадастр, навигацию и научные исследования.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/geo_point_close.jpg" alt="Геодезический знак крупным планом" className={styles.image} />
            <p className={styles.imageCaption}>Геодезический знак крупным планом</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/geo_point_wide.jpg" alt="Геодезический знак в широком ракурсе" className={styles.image} />
            <p className={styles.imageCaption}>Геодезический знак в широком ракурсе</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Общие сведения о геодезических знаках</h2>
        <p className={styles.paragraph}>
          Геодезические знаки устанавливаются в местах, выбранных с учетом
          требований точности измерений, удобства доступа и сохранности. Они
          могут быть различных типов, в зависимости от местных условий,
          климата, характера грунта и целей использования. Основная функция
          геодезических знаков — обеспечение стабильности и долговечности
          геодезических пунктов, что критически важно для поддержания
          точности координатной основы.
        </p>
        <p className={styles.paragraph}>
          Их конструкция включает в себя различные элементы:
        </p>
        <ul className={styles.list}>
          <li>Основание (фундамент), обеспечивающее устойчивость.</li>
          <li>Подземный центр — основная метка, хранящая координаты.</li>
          <li>Наземное сооружение (пирамида, сигнал, тур и т.д.), служащее
            для визирования и защиты центра.</li>
          <li>Охранные знаки и ограждения, предотвращающие повреждение или
            утрату пункта.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Виды геодезических знаков</h2>
        <p className={styles.paragraph}>
          Существует множество видов геодезических знаков, которые
          классифицируются по типу конструкции, материалу и назначению.
          Наиболее распространенные типы включают:
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Сигналы</h3>
            <p className={styles.paragraph}>
              Специальные деревянные или металлические конструкции
              пирамидальной формы, предназначенные для установки приборов
              на большой высоте и визирования на значительные расстояния.
              Могут быть простыми и сложными.
            </p>
          </div>

          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Пирамиды</h3>
            <p className={styles.paragraph}>
              Более простые, но также высокие конструкции, обеспечивающие
              видимость пункта в лесистой или пересеченной местности. Часто
              используются для триангуляции и полигонометрии.
            </p>
          </div>

          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Штативы</h3>
            <p className={styles.paragraph}>
              Небольшие переносные конструкции, используемые для временного
              закрепления приборов над точкой. Не являются стационарными
              геодезическими знаками.
            </p>
          </div>

          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Туры</h3>
            <p className={styles.paragraph}>
              Каменные или земляные насыпи в виде конуса, используемые для
              обозначения пунктов на скальных породах или в горных районах.
              Часто встречаются в труднодоступных местах.
            </p>
          </div>

          <div className={styles.featureItem}>
            <h3 className={styles.featureTitle}>Астрономические столбы</h3>
            <p className={styles.paragraph}>
              Монументальные сооружения, предназначенные для установки
              высокоточных астрономических приборов. Обладают высокой
              стабильностью и точностью.
            </p>
          </div>
        </div>
      </section>

      {/* Start of new content: Геодезический пункт */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Геодезический пункт</h2>
        <p className={styles.paragraph}>
          Геодезический пункт - точка, особым образом закреплённая на местности и являющаяся носителем координат, определённых геодезическими методами. Основная задача - сохранение в долговременной перспективе неизменного положения этой точки. По сути это целиком все сооружение состоящее из (см. картинку):
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/11.jpg" alt="Схема геодезического пункта" className={styles.image} />
            <p className={styles.imageCaption}>Схема геодезического пункта</p>
          </div>
        </div>
        <ol className={styles.list}>
          <li>1 — Наружного знака</li>
          <li>2 — Центра</li>
          <li>3 — Опознавательного монолита (столба)</li>
          <li>4 — Охранного (опознавательного) знака</li>
          <li>5 — Внешнее оформление</li>
          <li>6 — Ориентирных пунктов (где-то вдалеке)</li>
        </ol>
        <p className={styles.paragraph}>
          Следует понимать что геодезический пункт может состоять как и из всех этих частей, так и из разного их сочетания вплоть до минимума (просто марки).
        </p>
        <h3 className={styles.featureTitle}>Ссылки по теме:</h3>
        <ul className={styles.resourcesList}>
          <a href="https://order.cgkipd.ru/" className={styles.resourceLink}>Поиск пунктов (order.cgkipd.ru)</a>
          <a href="https://geobridge.ru/"  className={styles.resourceLink}>Состояние пунктов (geobridge.ru)</a>
          <a href="https://pbprog.ru/webservices/oms/"   className={styles.resourceLink}>Состояние пунктов (pbprog.ru/webservices/oms)</a>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Наружный знак</h2>
        <p className={styles.paragraph}>
          Наружный знак - это сооружение предназначенное для подъема на высоту обеспечивающую видимость (+обеспечивающую необходимую по нормативам высоту визирного луча над подстилающей поверхностью) визирной цели, инструмента, а также персонала с целью осуществления измерений. Существует большое количество разнообразных знаков, но, так как актуальность знаков на данный момент достаточно низкая, просто приведу примеры наиболее распространенных типов знаков.
        </p>
        <p className={styles.paragraph}>
          <a href="http://geodesist.ru/threads/kak-vygljadit-geodezicheskij-punkt-na-mestnosti.6910/page-17#post-235576" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>Хорошая классификация приведена тут</a>
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/21.jpg" alt="Типы наружных знаков" className={styles.image} />
            <p className={styles.imageCaption}>Типы наружных знаков: а) Тур, б) Пирамида, в) Простой сигнал, г) Сложный сигнал</p>
          </div>
        </div>
        <ul className={styles.list}>
          <li>Тур - а</li>
          <li>Пирамида - б</li>
          <li>Простой сигнал - в (внутренняя и наружная пирамида не соприкасаются)</li>
          <li>Сложный сигнал - г (внутренняя и наружная пирамида соединяются)</li>
        </ul>
        <h3 className={styles.featureTitle}>Подробнее:</h3>
        <ul className={styles.resourcesList}>
          <a href="http://geodesist.ru/resources/rukovodstvo-po-postrojke-geodezicheskix-znakov.45/" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>Шишкин В.Н. Руководство по постройке геодезических знаков.</a>
         <a href="http://www.geokniga.org/books/13811" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>Судаков С.Г. Основные геодезические сети</a>
          <a href="http://samlib.ru/p/parteigenosse/signals.shtml" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>Фурсов В.И. Геодезические сигналы и их постройка.</a>
       
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Центр</h2>
        <p className={styles.paragraph}>
          Центр пункта - это устройство, являющееся носителем координат геодезического пункта, на котором расположена марка: деталь , имеющая метку, к которой относят координаты пункта. В зависимости от типа центр может состоять просто из марки (к примеру в скале), из трубы с приваренной маркой, из бетонных монолитов поставленных друг на друга. Тип центра указывается в выписке и смотрится в альбоме типов центров и реперов. К примеру один из самых распространенных тип 1 состоит из 3 бетонных монолитов (под номером 1) с тремя марками(2). Марки имеют одинаковые плановые координаты, но разную высоту. В случае использования в качестве пункта местного предмета (башня, труба, шпиль) может использоваться снесенный центр - отдельно расположенный центр с собственными координатами.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
          
          </div>
        </div>
        <p className={styles.paragraph}>
          Большинство центров созданы с большим запасом прочности, поэтому довольно живучи: количество марок расположенных на одной отвесной линии может достигать 5 (тип 24), помимо этого на некоторых типах пунктов может быть несколько марок на верхней грани монолита, а то и отдельно заложенные секретные центры (марки и центры обычно расположены крестообразно относительно основного и предназначены для восстановление его местоположения в случае его утраты).
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/42.jpg" alt="Марки на одной линии" className={styles.image} />
            <p className={styles.imageCaption}>Марки на одной отвесной линии</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/43.jpg" alt="Несколько марок на верхней грани монолита" className={styles.image} />
            <p className={styles.imageCaption}>Несколько марок на верхней грани монолита</p>
          </div>
        </div>
        <p className={styles.paragraph}>
          В качестве марки может использоваться банально марка, рельс, штырь, гранитный валун и т.д. Координаты пункта отнесены к центру марки обозначенному пересечением штрихов, отверстием либо геометрическим центром. На марку либо на бетон верхней грани монолита наносится номер марки (название пункта) и название организации заложившей пункт (ГУГК, ВГУ, НКВД, ВТС и тд), также может быть написан метод развития сети (ТРИАНГ, ПОЛИГ).
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/44.jpg" alt="Марка" className={styles.image} />
            <p className={styles.imageCaption}>Марка</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/45.JPG" alt="Рельс" className={styles.image} />
            <p className={styles.imageCaption}>Рельс</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/46.JPG" alt="Штырь" className={styles.image} />
            <p className={styles.imageCaption}>Штырь</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/47.JPG" alt="Гранитный валун" className={styles.image} />
            <p className={styles.imageCaption}>Гранитный валун</p>
          </div>
        </div>
        <h3 className={styles.featureTitle}>Подробнее:</h3>
        <ul className={styles.resourcesList}>

          <a href="https://geodesist.ru/threads/albom-tipov-centrov-i-reperov.59124/#post-652146"  rel="noopener noreferrer" className={styles.resourceLink}>Альбом от Роскатографии</a>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Опознавательный монолит (столб)</h2>
        <p className={styles.paragraph}>
          Лежит непосредственно на центре пункта и предназначен для его защиты, легкого отыскания и неточных работ без вскрытия основного центра (изначально, уже неактуально). Обычно представляет из себя бетонный монолит с нанесенным перекрестием либо небольшой маркой. В случае наличия к типу центра добавляется оп: тип 3оп (но далеко не всегда).
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/51.JPG" alt="Опознавательный монолит" className={styles.image} />
            <p className={styles.imageCaption}>Опознавательный монолит</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Охранный (опознавательный) знак</h2>
        <p className={styles.paragraph}>
          Предназначен для облегчения отыскания центра. Представляет из себя бетонный пилон или металлическую трубу с охранной плитой. Расположен в 0,8-1,8 метрах от центра плитой в его сторону.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/62.JPG" alt="Охранный знак" className={styles.image} />
            <p className={styles.imageCaption}>Охранный (опознавательный) знак</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Внешнее оформление</h2>
        <p className={styles.paragraph}>
          Внешнее оформление предназначено для облегчения отыскания центров и способствует их долговременной сохранности, устойчивости и неподвижности. Оно выполняет функции отвода дождевых и талых вод, уменьшения глубины оттаивания (в районах многолетней мерзлоты) и промерзания (в районах сезонного промерзания), защиты от выдувания песков. Представляет из себя окопку по периметру пункта канавой (либо валик из камня), курган из земли (камня) над центром, деревянный сруб заполненный землей(мхом, углем), маты из камыша и тд.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/71.jpg" alt="Внешнее оформление 1" className={styles.image} />
            <p className={styles.imageCaption}>Внешнее оформление (окопка)</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/72.jpg" alt="Внешнее оформление 2" className={styles.image} />
            <p className={styles.imageCaption}>Внешнее оформление (курган)</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/73.jpg" alt="Внешнее оформление 3" className={styles.image} />
            <p className={styles.imageCaption}>Внешнее оформление (сруб)</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ориентирный пункт</h2>
        <p className={styles.paragraph}>
          Ориентирные пункты предназначены для закрепления направлений с пунктов и облегчения отыскания центров. Ориентирные пункты закладывались по 2 штуки на каждый пункт ГГС на расстоянии 250-1000 метров, в отдельных случаях вместо них использовались соседние пункты либо местные предметы. ОРП представляет собой бетонный пилон либо металлическую трубу с маркой и охранной плитой (направлена в сторону центра). Вокруг ОРП делается окопка. Марка ОРП обычно с надписью ОРИЕНТ, но попадаются и центры пунктов ГГС с такими марками.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/82.JPG" alt="Ориентирный пункт 1" className={styles.image} />
            <p className={styles.imageCaption}>Ориентирный пункт</p>
          </div>
          <div className={styles.imageItem}>
            <img src="/81.JPG" alt="Ориентирный пункт 2" className={styles.image} />
            <p className={styles.imageCaption}>Ориентирный пункт с маркой ОРИЕНТ</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Пункт на здании (сооружении)</h2>
        <p className={styles.paragraph}>
          Пункт ГГС на здании представляет собой по сути обычный пункт, просто закинутый на крышу: также центр с маркой (может быть и несколько марок), наружный знак в виде пирамиды или сигнала, площадка для наблюдателя. Обычно располагаются на капитальных стенах.
        </p>
        <div className={styles.imageGallery}>
          <div className={styles.imageItem}>
            <img src="/91.jpg" alt="Пункт на здании 1" className={styles.image} />
            <p className={styles.imageCaption}>Пункт на здании (общий вид)</p>
          </div>
       
       
        </div>
      </section>
    </div>
  );
};

export default InfoPage; 