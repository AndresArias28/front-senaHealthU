# 🏋️‍♂️ Gym SENA – Frontend

Aplicación web desarrollada en **Angular 19** para la gestión de rutinas, desafíos y usuarios en el proyecto **HealthU**.

---

## 📦 Stack Tecnológico

- **Framework principal:** Angular 19 (CLI 19.1.2)  
- **Lenguaje:** TypeScript ~5.7.2  
- **Diseño y UI:**  
  - Angular Material (^19.2.19)  
  - Bootstrap 5.3.7  
  - Bootstrap Icons 1.11.3  
  - SweetAlert2 11.23.0  
- **Gráficas:** Chart.js (^4.4.8)  
- **Autenticación:** jwt-decode (^4.0.0)  
- **Utilidades:** RxJS (~7.8.0), ngx-bootstrap (^19.0.2), ngx-sonner (^3.0.0)  
- **Testing:** Karma + Jasmine  

---

## ⚙️ Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (versión LTS recomendada: ≥ 18)  
- **Angular CLI**:  
  ```bash
  npm install -g @angular/cli

---

## 🚀 Instalación
- **Clonar repo**:  

  ```bash
  git clone https://github.com/tu-usuario/tu-repo.git
  cd tu-repo

- **Instalar dependencias**:  

  ```bash
  npm install
---

## ▶️ Scripts disponibles

Antes de empezar, asegúrate de tener instalado:
En el archivo package.json encontrarás los siguientes scripts:

- **npm start**    → Levanta la app en modo desarrollo
- **npm run build** → Compila la aplicación para producción
- **ng s**    → Levantar el servidor en desarrollo
- **npm watch** → Compila con watch en modo dev

---

## 📂 Estructura del proyecto 

  ```bash
  src/
├── app/
│   ├── core/                # Servicios, guards, interceptores
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── feature/             # Módulos principales de la aplicación
│   ├── login2/              # Módulo de login
│   ├── modales/             # Componentes de modales
│   ├── shared/              # Componentes/recursos compartidos
│   ├── app.component.*      # Componente raíz
│   ├── app.routes.ts        # Rutas principales
│   └── app.config.ts        # Configuración general
├── assets/                  # Imágenes, fuentes, etc.
├── environments/            # Configuración para distintos entornos
├── index.html               # Entrada principal
├── main.ts                  # Bootstrap de la app
├── styles.css               # Estilos globales

