# 📦 Система управления складскими запасами

Веб-приложение для учёта товаров на складе с личным кабинетом, управлением категориями и аналитикой остатков.

## ✨ Функциональность

- 🔐 Регистрация и авторизация (JWT)
- 📊 Дашборд с общей статистикой склада
- 📦 Управление товарами (CRUD)
- 📂 Управление категориями (CRUD)
- 👤 Личный кабинет с загрузкой аватара
- 🌙 Переключение светлой/тёмной темы
- 📱 Адаптивный дизайн (ПК, планшет, телефон)

---

## 🛠 Технологии

| Слой | Стек |
|------|------|
| **Backend** | Python 3.13, Django 6.0, Django REST Framework, Djoser, Pillow |
| **Frontend** | React 18, TypeScript, Redux Toolkit, Vite, Axios, React Router |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Auth** | JWT (djangorestframework-simplejwt) |

---
## 📁 Структура проекта
```text
├── config/ # Настройки Django
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
├── users/ # Приложение пользователей
│ ├── models.py # Кастомная модель User
│ ├── serializers.py
│ └── views.py
├── warehouse/ # Приложение склада
│ ├── models.py # Модели Category, Product
│ ├── serializers.py
│ ├── views.py
│ └── urls.py
├── frontend/ # React-приложение
│ ├── src/
│ │ ├── api/ # Axios-клиент
│ │ ├── components/ # Переиспользуемые компоненты
│ │ ├── pages/ # Страницы приложения
│ │ ├── store/ # Redux Toolkit (слайсы)
│ │ ├── types/ # TypeScript-типы
│ │ └── themes.css # CSS-переменные и темы
│ ├── package.json
│ └── vite.config.ts
├── manage.py
├── requirements.txt
└── README.md
```
---


---

## 🚀 Локальный запуск

### 📋 Требования

| Компонент | Версия |
|-----------|--------|
| Node.js | 18+ |
| npm | 9+ |
| Python | 3.10+ |
| pip | 23+ |

### 1. Клонирование репозитория

```bash
git clone https://github.com/MUBOR1/internet-tech-kursach.git
cd internet-tech-kursach
```
#### 2. Запуск бэкенда (Django)

```bash
Создание виртуального окружения
python -m venv venv

Активация (Windows)
venv\Scripts\activate

Установка зависимостей
pip install -r requirements.txt

Миграции
python manage.py migrate

Создание суперпользователя
python manage.py createsuperuser

Запуск сервера
python manage.py runserver

Бэкенд: http://127.0.0.1:8000/
```

#### 3. Запуск фронтенда (React)
```bash
cd frontend
npm install
npm run dev
Фронтенд будет доступен по адресу: http://localhost:5173/
```

## 📡 API Endpoints
| Метод | Путь |Описание|
|------|------|-----|
| **POST** |/api/auth/users/  |Регистрация|
| **POST** | /api/auth/jwt/create/ |Вход|
| **GET** | /api/products/ |Список товаров|
| **POST** |/api/products/  |Создание товара|
|**GET**|/api/categories/|Список категорий|
|**GET**|/api/profile/me/|Профиль пользователя|
---

## 🎨 Темизация

##### Приложение поддерживает светлую и тёмную темы. Выбор пользователя сохраняется в localStorage. CSS-переменные определены в frontend/src/themes.css ####
---
## 📱 Адаптивный дизайн
Приложение оптимизировано для всех устройств:
| Устройство | Ширина экрана |Особенности|
|------|------|-----|
| **ПК** |> 1024px|Полный вид, 4 колонки статистики|
| **Планшет** |768px – 1024px|2 колонки статистики|
| **Мобильный** |< 768px|1 колонка, вертикальное меню|
---

## 🔐 Переменные окружения
| Переменная | По умолчанию |Описание|
|------|------|-----|
| **DEBUG** |True|Режим отладки Django|
| **SECRET_KEY** |—|Секретный ключ Django|
| **DATABASE_URL** |sqlite:///db.sqlite3|URL подключения к БД|
|**ALLOWED_HOSTS**|localhost,127.0.0.1|Разрешённые хосты|

## 📝 Лицензия

---

Проект выполнен в рамках курсовой работы. Все права защищены.