'use strict';


const availableSpecializations = [
  'Уголовное право',
  'Гражданское право',
  'Семейное право',
  'Трудовое право',
  'Налоговое право',
  'Административное право',
  'Конституционное право',
  'Международное право',
  'Финансовое право',
  'Банковское право',
  'Корпоративное право',
  'Договорное право',
  'Наследственное право',
  'Жилищное право',
  'Земельное право',
  'Экологическое право',
  'Интеллектуальная собственность',
  'Авторское право',
  'Патентное право',
  'Информационное право (IT-право)',
  'Киберправо',
  'Медицинское право',
  'Фармацевтическое право',
  'Транспортное право',
  'Автомобильное право',
  'Воздушное право',
  'Морское право',
  'Таможенное право',
  'Миграционное право',
  'Социальное право',
  'Пенсионное право',
  'Страховое право',
  'Конкурсное право',
  'Антимонопольное право',
  'Защита прав потребителей',
  'Спортивное право',
  'Муниципальное право',
  'Военное право',
  'Космическое право',
  'Энергетическое право',
  'Природоресурсное право',
  'Аграрное право',
  'Водное право',
  'Лесное право',
  'Недропользование',
  'Медиаправо',
  'Рекламное право',
  'Арбитражное процессуальное право',
  'Гражданское процессуальное право',
  'Уголовно-процессуальное право',
  'Исполнительное производство',
  'Право социального обеспечения',
  'Ювенальное право',
  'Криминология',
  'Правоохранительная деятельность',
  'Пенитенциарное право',
  'Алименты',
  'Коммерческое право',
  'Торговое право',
  'Валютное право',
  'Инвестиционное право',
  'Рынок ценных бумаг',
  'Фондовое право',
  'Вексельное право',
  'Трудовые споры',
  'Защита персональных данных',
  'Бюджетное право',
  'Государственные закупки',
  'Публичное право',
  'Частное право',
  'Сравнительное правоведение',
  'История государства и права',
  'Теория государства и права',
  'Философия права',
  'Правовая статистика',
  'Правовая информатика',
  'Юридическая психология',
  'Юридическая этика',
  'Нотариальное право',
  'Адвокатура',
  'Прокурорский надзор',
  'Судебная экспертиза',
  'Юридический перевод',
  'Третейское разбирательство',
  'Медиация',
  'Альтернативное разрешение споров'
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Specializations', 
      availableSpecializations.map(name => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date()
      })), 
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Specializations', {
      name: availableSpecializations
    }, {});
  }
};