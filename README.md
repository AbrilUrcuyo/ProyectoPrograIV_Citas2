# Sistema de Gestión de Citas Médicas

Este proyecto es una aplicación web fullstack para la gestión de citas médicas, desarrollada con Java (Spring Boot) para el backend y React para el frontend. Permite a pacientes, médicos y administradores interactuar en un entorno seguro y eficiente para la administración de citas, horarios y usuarios.

## Tabla de Contenidos
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías y Herramientas](#tecnologías-y-herramientas)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Contribución](#contribución)
- [Autores](#autores)

## Características
- Registro y autenticación de usuarios con JWT
- Gestión de pacientes, médicos y administradores
- Reserva, consulta y administración de citas médicas
- Gestión de horarios de médicos
- Paneles diferenciados según el rol del usuario
- Interfaz moderna y responsiva

## Arquitectura
El sistema está dividido en dos grandes módulos:
- **Backend**: API RESTful desarrollada en Java con Spring Boot, encargada de la lógica de negocio, persistencia y seguridad.
- **Frontend**: Aplicación SPA desarrollada en React, que consume la API y ofrece una experiencia de usuario interactiva.

## Tecnologías y Herramientas
### Backend
- Java 17+
- Spring Boot
- Spring Security (JWT)
- JPA/Hibernate
- Maven
- MySQL

### Frontend
- React
- JavaScript 
- CSS Modules
- npm

### Herramientas de Desarrollo
- Visual Studio Code / IntelliJ IDEA
- Postman (para pruebas de API)
- Git

## Instalación y Ejecución
### 1. Clonar el repositorio
```bash
git clone <URL-del-repositorio>
cd ProyectoPrograIV_Citas2
```

### 2. Backend
```bash
cd backend
# Ejecutar con Maven Wrapper
y ./mvnw spring-boot:run
```
El backend estará disponible en `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
El frontend estará disponible en `http://localhost:3000`.

## Estructura del Proyecto
```
ProyectoPrograIV_Citas2/
├── backend/
│   ├── src/main/java/org/example/backend/
│   │   ├── data/           # Repositorios JPA
│   │   ├── logic/          # Entidades y lógica de negocio
│   │   └── presentation/   # Controladores REST
│   └── ...
├── frontend/
│   ├── src/pages/          # Vistas por rol y funcionalidad
│   └── ...
└── README.md
```

## Uso
1. Regístrate como paciente, médico o administrador.
2. Inicia sesión para acceder a las funcionalidades según tu rol.
3. Reserva, consulta y administra citas médicas.
4. Los administradores pueden gestionar usuarios y médicos.

## Contribución
¡Las contribuciones son bienvenidas! Puedes abrir issues o pull requests para sugerir mejoras o reportar errores.

## Autores
Abril Urcuyo Arce,
María Fernanda Segura Largaespada,
Laura Flores Barrantes.

---

