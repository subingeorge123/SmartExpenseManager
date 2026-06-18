# Smart Expense Manager

Smart Expense Manager is a full-stack web application that enables users to efficiently track and manage their expenses. The project consists of a React-based frontend and a Flask-based backend, providing a responsive user interface and RESTful API services.

---

## 📁 Repository Structure

```text
.
├── SmartExpenseManager-Backend/
│   ├── .ebextensions/
│   ├── .github/workflows/
│   ├── .platform/nginx/conf.d/
│   ├── tests/
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt
│   └── sonar-project.properties
│
├── SmartExpenseManager-Frontend/
│   ├── .github/workflows/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── sonar-project.properties
│
└── README.md
```

---

# 🚀 Features

* Expense tracking and management
* Add, update, and delete expenses
* Responsive user interface
* REST API integration
* Automated CI/CD using GitHub Actions
* Unit testing support
* SonarQube code quality analysis
* AWS Elastic Beanstalk deployment support

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

## Backend

* Python
* Flask
* REST APIs
* Gunicorn

## DevOps & Tools

* GitHub Actions
* SonarQube
* AWS Elastic Beanstalk
* Nginx
* Coverage.py
* Pytest

---

# 🏗 Architecture

```text
                    ┌─────────────────┐
                    │     Frontend    │
                    │  React + Vite   │
                    └────────┬────────┘
                             │
                             │ REST API
                             ▼
                    ┌─────────────────┐
                    │     Backend     │
                    │ Flask + Python  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Database     │
                    └─────────────────┘
```

---

# ⚙️ Backend Setup

```bash
cd SmartExpenseManager-Backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

python app.py
```

Backend runs on:

```
http://localhost:5000
```

---

# ⚙️ Frontend Setup

```bash
cd SmartExpenseManager-Frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🧪 Running Tests

### Backend

```bash
pytest
```

Generate coverage report:

```bash
coverage run -m pytest
coverage report
```

---

# 🔄 CI/CD

GitHub Actions are configured for:

* Build automation
* Testing
* Continuous Integration
* Code quality checks

Workflow files are located in:

```text
.github/workflows/
```

---

# 📊 Code Quality

The project uses SonarQube for:

* Static code analysis
* Coverage reporting
* Maintainability checks
* Code smell detection

---

# ☁️ Deployment

The backend is configured for deployment using:

* AWS Elastic Beanstalk
* Nginx
* Procfile
* Runtime configuration

---

# 🔮 Future Enhancements

* JWT Authentication
* User profile management
* Budget planning
* Expense categories
* Analytics dashboard
* Charts and reports
* Docker support
* Kubernetes deployment
* Prometheus and Grafana monitoring

---

# 👨‍💻 Author

**Subin George**

MSc Cloud Computing
National College of Ireland

---

# 📄 License

This project is developed for educational and learning purposes.
