
# Training Management System

A full-stack web application for managing training centers, built with FastAPI (backend) and React (frontend). Supports JWT authentication, CRUD operations, statistics, CSV export, and multi-language UI (Arabic by default, English, French). Tables are fully responsive and translation keys are managed in locale files.

## Features
- JWT authentication (login/logout)
- Manage participants, formateurs, and cycles (CRUD)
- Advanced statistics dashboard
- CSV export of all data
- Responsive, modern UI with icons and tables that adapt to all screen sizes
- Multi-language support (Arabic by default, English, French)
- Protected routes and role-based access
- Language switcher with instant UI update
- All table headers and forms use translation keys from locale files

## Tech Stack
- **Backend:** FastAPI, MySQL
- **Frontend:** React, react-i18next, react-icons, Vite

## Getting Started

### Backend
1. Install dependencies:
	```bash
	pip install -r requirements.txt
	```
2. Configure your MySQL database in `app/config.py`.
3. Run the backend:
	```bash
	python main.py
	```

Backend runs on [http://localhost:8000](http://localhost:8000)

### Frontend
1. Install dependencies:
	```bash
	npm install
	```
2. Start the frontend:
	```bash
	npm run dev
	```
3. Access the app at [http://localhost:5173](http://localhost:5173)

Default language is Arabic. You can switch languages at any time using the language switcher in the UI.

## Usage
- Login with your admin credentials.
- Use the navbar to navigate between dashboard, participants, formateurs, and cycles.
- Add, edit, delete, and filter records. All tables are scrollable and responsive.
- View statistics and export data as CSV.
- Switch languages instantly using the language switcher (Arabic, French, English).

## Folder Structure
```
backend/
	app/
		config.py
		database.py
		main.py
		security.py
		routes/
			auth.py
			participant.py
			formateur.py
			cycles.py
	frontend/
		src/
			App.jsx
			Navbar.jsx
			Dashboard.jsx
			Participants.jsx
			Formateurs.jsx
			Cycles.jsx
			LanguageSwitcher.jsx
			api.js
			i18n.js
			locales/
				en.json
				fr.json
				ar.json
			App.css
```
