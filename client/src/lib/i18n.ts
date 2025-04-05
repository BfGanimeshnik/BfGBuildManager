// Простая система локализации для приложения
type Language = 'en' | 'ru';
type Translations = Record<string, Record<string, string>>;

// Переводы строк приложения
const translations: Translations = {
  'en': {
    // Общие элементы интерфейса
    'app.title': 'Albion Online Build Manager',
    'app.subtitle.admin': 'Admin Dashboard',
    'app.subtitle.guest': 'Build Browser',
    
    // Боковое меню - разделы
    'sidebar.management': 'Management',
    'sidebar.navigation': 'Navigation',
    'sidebar.specialFilters': 'Special Filters',
    'sidebar.activityTypes': 'Activity Types',
    
    // Боковое меню - пункты меню (управление)
    'sidebar.menu.builds': 'Builds',
    'sidebar.menu.createBuild': 'Create Build',
    'sidebar.menu.settings': 'Settings',
    'sidebar.menu.statistics': 'Statistics',
    
    // Боковое меню - специальные фильтры
    'sidebar.filters.meta': 'Meta Builds',
    'sidebar.filters.recent': 'Recent Builds',
    
    // Боковое меню - типы активности
    'sidebar.activities.soloPvp': 'Solo PvP',
    'sidebar.activities.groupPvp': 'Group PvP',
    'sidebar.activities.ganking': 'Ganking',
    'sidebar.activities.gathering': 'Gathering',
    'sidebar.activities.avalon': 'Avalon',
    'sidebar.activities.farming': 'Farming',
    
    // Статусы пользователя
    'user.guest': 'Guest',
    'user.status.online': 'Online',
    'user.status.browseOnly': 'Browse Only',
    
    // Верхняя навигация
    'header.builds_manager': 'Builds Manager',
    'header.search_placeholder': 'Search builds...',
    'header.new_build': 'New Build',
    
    // Вкладки фильтров
    'tabs.all_builds': 'All Builds',
    'tabs.recent': 'Recent',
    'tabs.meta_builds': 'Meta Builds',
    
    // Фильтры на странице сборок
    'filters.all_activity_types': 'All Activity Types',
    'filters.active_filters': 'Active filters:',
    
    // Состояния загрузки и ошибок
    'status.loading': 'Loading...',
    'status.error.title': 'Failed to load builds',
    'status.error.message': 'Please try again later.',
    'status.retry': 'Retry',
    'status.no_builds.title': 'No builds found',
    'status.no_builds.filter_message': 'Try changing your search or filter criteria.',
    'status.no_builds.empty_message': 'Create your first build to get started.',
    'status.create_new_build': 'Create New Build',
    'status.showing_builds': 'Showing',
    'status.builds': 'builds',
    'status.build': 'build',
    
    // Карточка сборки
    'build_card.view': 'View',
    'build_card.edit': 'Edit',
    'build_card.delete': 'Delete',
    'build_card.meta': 'META',
    'build_card.updated': 'Updated',
    
    // Подтверждение удаления
    'delete.title': 'Delete Build',
    'delete.message': 'Are you sure you want to delete this build? This action cannot be undone.',
    'delete.cancel': 'Cancel',
    'delete.confirm': 'Delete',
    
    // Уведомления
    'toast.delete_success.title': 'Build Deleted',
    'toast.delete_success.message': 'The build has been successfully deleted.',
    'toast.delete_error.title': 'Error',
    'toast.delete_error.message': 'Failed to delete the build. Please try again.',
    
    // Аутентификация
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.error.title': 'Authentication Error',
    'auth.error.message': 'Invalid username or password',
  },
  
  'ru': {
    // Детали сборки
    'build.detail.weapon_alternatives': 'Альтернативное оружие',
    'build.detail.armor_alternatives': 'Альтернативная броня',
    'build.detail.consumable_alternatives': 'Альтернативные расходники',
    'build.detail.build_info': 'Информация о сборке',
    'build.detail.equipment_set': 'Комплект экипировки',
    'build.detail.last_updated': 'Последнее обновление',
    'build.detail.estimated_cost': 'Примерная стоимость',
    'build.detail.command_usage': 'Использование команды',
    'build.detail.no_description': 'Описание отсутствует',
    'build.detail.delete_confirm': 'Вы уверены, что хотите удалить эту сборку?',
    'build.detail.delete_warning': 'Это действие нельзя отменить.',
    'build.detail.edit_build': 'Редактировать',
    'build.detail.back_to_builds': 'Назад к сборкам',
    'build.detail.loading': 'Загрузка сборки...',
    'build.detail.not_found': 'Сборка не найдена',
    'build.detail.load_error': 'Не удалось загрузить сборку',
    'build.detail.no_permission': 'Сборка не существует или у вас нет прав для её просмотра.',

    // Форма создания/редактирования сборки
    'build_form.tabs.basic': 'Основное',
    'build_form.tabs.equipment': 'Экипировка',
    'build_form.tabs.alternatives': 'Альтернативы',
    'build_form.tabs.image': 'Изображение',
    
    'build_form.basic.title': 'Основная Информация',
    'build_form.basic.name': 'Название Сборки',
    'build_form.basic.name.placeholder': 'например, Соло Билд на Секире',
    'build_form.basic.description': 'Описание',
    'build_form.basic.description.placeholder': 'Опишите для чего используется эта сборка',
    'build_form.basic.activity': 'Тип Активности',
    'build_form.basic.alias': 'Команда',
    'build_form.basic.alias.placeholder': 'например, sekira-solo',
    'build_form.basic.alias.description': 'Будет использоваться в Discord командах как /build [команда]',
    'build_form.basic.tier': 'Базовый Тир',
    'build_form.basic.cost': 'Примерная Стоимость',
    'build_form.basic.cost.placeholder': 'например, 1.2М Серебра',
    'build_form.basic.meta': 'МЕТА Сборка',
    'build_form.basic.meta.description': 'Отметить эту сборку как текущую мету/рекомендуемую',
    
    'build_form.equipment.weapons': 'Оружие и Оффхенд',
    'build_form.equipment.weapon': 'Оружие',
    'build_form.equipment.weapon.placeholder': 'например, Большая Секира',
    'build_form.equipment.offhand': 'Оффхенд',
    'build_form.equipment.offhand.placeholder': 'например, Щит или Факел (необязательно)',
    'build_form.equipment.armor': 'Броня',
    'build_form.equipment.head': 'Шлем',
    'build_form.equipment.head.placeholder': 'например, Колпак Ученого',
    'build_form.equipment.chest': 'Нагрудник',
    'build_form.equipment.chest.placeholder': 'например, Роба Клирика',
    'build_form.equipment.shoes': 'Ботинки',
    'build_form.equipment.shoes.placeholder': 'например, Сандалии Ученого',
    'build_form.equipment.cape': 'Плащ',
    'build_form.equipment.cape.placeholder': 'например, Плащ Тетфорда (необязательно)',
    'build_form.equipment.consumables': 'Расходники',
    'build_form.equipment.food': 'Еда',
    'build_form.equipment.food.placeholder': 'например, Говяжье Рагу (необязательно)',
    'build_form.equipment.potion': 'Зелье',
    'build_form.equipment.potion.placeholder': 'например, Зелье Сопротивления (необязательно)',
    
    'build_form.equipment.tier': 'Тир',
    'build_form.equipment.quality': 'Качество',
    'build_form.equipment.quality.normal': 'Обычное',
    
    'build_form.alternatives.weapon': 'Альтернативное Оружие',
    'build_form.alternatives.weapon.name': 'Название Оружия',
    'build_form.alternatives.weapon.name.placeholder': 'например, Алебарда',
    'build_form.alternatives.weapon.description': 'Описание',
    'build_form.alternatives.weapon.description.placeholder': 'например, Для большей дальности',
    'build_form.alternatives.weapon.add': 'Добавить Альтернативное Оружие',
    
    'build_form.alternatives.armor': 'Альтернативная Броня',
    'build_form.alternatives.armor.name': 'Название Брони',
    'build_form.alternatives.armor.name.placeholder': 'например, Куртка Хеллиона',
    'build_form.alternatives.armor.description': 'Описание',
    'build_form.alternatives.armor.description.placeholder': 'например, Для большей выживаемости',
    'build_form.alternatives.armor.add': 'Добавить Альтернативную Броню',
    
    'build_form.alternatives.consumable': 'Альтернативные Расходники',
    'build_form.alternatives.consumable.name': 'Название Расходника',
    'build_form.alternatives.consumable.name.placeholder': 'например, Омлет',
    'build_form.alternatives.consumable.description': 'Описание',
    'build_form.alternatives.consumable.description.placeholder': 'например, Более дешевый вариант',
    'build_form.alternatives.consumable.add': 'Добавить Альтернативный Расходник',
    
    'build_form.image.title': 'Изображение Сборки',
    'build_form.image.upload': 'Загрузить Изображение',
    'build_form.image.drag': 'или перетащите файл',
    'build_form.image.format': 'PNG, JPG, GIF или SVG (макс. 5MB)',
    'build_form.image.description': 'Загрузите изображение, представляющее эту сборку. Изображение будет показано в деталях сборки и в сообщениях Discord.',
    
    'build_form.buttons.cancel': 'Отмена',
    'build_form.buttons.saving': 'Сохранение...',
    'build_form.buttons.create': 'Создать Сборку',
    'build_form.buttons.update': 'Обновить Сборку',

    // Общие элементы интерфейса
    'app.title': 'Менеджер Сборок Альбион Онлайн',
    'app.subtitle.admin': 'Панель Администратора',
    'app.subtitle.guest': 'Просмотр Сборок',
    
    // Боковое меню - разделы
    'sidebar.management': 'Управление',
    'sidebar.navigation': 'Навигация',
    'sidebar.specialFilters': 'Специальные Фильтры',
    'sidebar.activityTypes': 'Типы Активности',
    
    // Боковое меню - пункты меню (управление)
    'sidebar.menu.builds': 'Сборки',
    'sidebar.menu.createBuild': 'Создать Сборку',
    'sidebar.menu.settings': 'Настройки',
    'sidebar.menu.statistics': 'Статистика',
    
    // Боковое меню - специальные фильтры
    'sidebar.filters.meta': 'МЕТА Сборки',
    'sidebar.filters.recent': 'Недавние Сборки',
    
    // Боковое меню - типы активности
    'sidebar.activities.soloPvp': 'Соло PvP',
    'sidebar.activities.groupPvp': 'Групповой PvP',
    'sidebar.activities.ganking': 'Ганки',
    'sidebar.activities.gathering': 'Сбор Ресурсов',
    'sidebar.activities.avalon': 'Авалон',
    'sidebar.activities.farming': 'Фарминг',
    
    // Статусы пользователя
    'user.guest': 'Гость',
    'user.status.online': 'Онлайн',
    'user.status.browseOnly': 'Только Просмотр',
    
    // Верхняя навигация
    'header.builds_manager': 'Менеджер Сборок',
    'header.search_placeholder': 'Поиск сборок...',
    'header.new_build': 'Новая Сборка',
    
    // Вкладки фильтров
    'tabs.all_builds': 'Все Сборки',
    'tabs.recent': 'Недавние',
    'tabs.meta_builds': 'МЕТА Сборки',
    
    // Фильтры на странице сборок
    'filters.all_activity_types': 'Все Типы Активности',
    'filters.active_filters': 'Активные фильтры:',
    
    // Состояния загрузки и ошибок
    'status.loading': 'Загрузка...',
    'status.error.title': 'Не удалось загрузить сборки',
    'status.error.message': 'Пожалуйста, попробуйте позже.',
    'status.retry': 'Повторить',
    'status.no_builds.title': 'Сборки не найдены',
    'status.no_builds.filter_message': 'Попробуйте изменить критерии поиска или фильтрации.',
    'status.no_builds.empty_message': 'Создайте вашу первую сборку, чтобы начать.',
    'status.create_new_build': 'Создать Новую Сборку',
    'status.showing_builds': 'Показано',
    'status.builds': 'сборок',
    'status.build': 'сборка',
    
    // Карточка сборки
    'build_card.view': 'Просмотр',
    'build_card.edit': 'Изменить',
    'build_card.delete': 'Удалить',
    'build_card.meta': 'МЕТА',
    'build_card.updated': 'Обновлено',
    
    // Подтверждение удаления
    'delete.title': 'Удаление Сборки',
    'delete.message': 'Вы уверены, что хотите удалить эту сборку? Это действие нельзя отменить.',
    'delete.cancel': 'Отмена',
    'delete.confirm': 'Удалить',
    
    // Уведомления
    'toast.delete_success.title': 'Сборка Удалена',
    'toast.delete_success.message': 'Сборка была успешно удалена.',
    'toast.delete_error.title': 'Ошибка',
    'toast.delete_error.message': 'Не удалось удалить сборку. Пожалуйста, попробуйте снова.',
    
    // Аутентификация
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.logout': 'Выход',
    'auth.username': 'Имя пользователя',
    'auth.password': 'Пароль',
    'auth.error.title': 'Ошибка Аутентификации',
    'auth.error.message': 'Неверное имя пользователя или пароль',
  }
};

// Текущий выбранный язык
let currentLanguage: Language = 'en';

// Переключение языка
export function setLanguage(lang: Language): void {
  if (translations[lang]) {
    currentLanguage = lang;
    // Сохраняем выбор языка в localStorage для сохранения между сессиями
    localStorage.setItem('language', lang);
    // Вызываем событие для обновления компонентов
    window.dispatchEvent(new Event('languageChanged'));
  }
}

// Получение текущего языка
export function getLanguage(): Language {
  return currentLanguage;
}

// Получение перевода по ключу
export function t(key: string, defaultValue?: string): string {
  const translation = translations[currentLanguage]?.[key];
  return translation || defaultValue || key;
}

// Инициализация: проверяем сохраненный язык в localStorage
export function initializeLanguage(): void {
  // Проверяем предпочтительный язык из localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  } else {
    // Пытаемся определить язык браузера
    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) {
      currentLanguage = browserLang;
    }
  }
}

// Инициализируем язык при импорте модуля
initializeLanguage();

// Хук для использования переводов в компонентах React
import { useState, useEffect } from 'react';

export function useTranslation() {
  const [_, forceUpdate] = useState(0);
  
  useEffect(() => {
    // Обновляем компонент при изменении языка
    const handleLanguageChange = () => forceUpdate(prev => prev + 1);
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  return { t, currentLanguage, setLanguage };
}