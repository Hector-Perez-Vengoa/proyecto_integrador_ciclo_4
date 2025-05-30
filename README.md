
## Requisitos Previos//Ejemplo previo

Asegúrate de tener instalados los siguientes programas en tu máquina:

- **Docker** (para contenerizar la aplicación y facilitar su ejecución)
- **Docker Compose** (para orquestar los contenedores)
- **Node.js y npm** (para ejecutar el frontend React)
- **Java JDK 11 o superior** (para ejecutar el backend Spring Boot)
- **Python 3.8 o superior** (para ejecutar el backend Django)
- **MySQL** (base de datos utilizada, configurada a través de XAMPP o Docker)

## Estructura del Proyecto

La estructura del repositorio es la siguiente:

    ```bash
    /proyecto
        /frontend
            /react            -> Frontend web en React
            /kotlin           -> Frontend móvil en Kotlin
        /backend
            /django           -> Backend de administración con Django
            /springboot       -> Backend de usuario con Spring Boot
        /database
            /mysql            -> Configuración de base de datos MySQL
    ```

## Instalación

### 1. Frontend Web (React)

Para configurar y ejecutar el frontend web:

1. Navega al directorio `frontend/react`:

    ```bash
    cd proyecto/frontend/react
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3. Ejecuta el proyecto en modo de desarrollo:

    ```bash
    npm start
    ```

### 2. Frontend Móvil (Kotlin)

Para configurar y ejecutar el frontend móvil:

1. Navega al directorio `frontend/kotlin`:

    ```bash
    cd proyecto/frontend/kotlin
    ```

2. Abre el proyecto en **Android Studio** o tu IDE preferido para Kotlin.

3. Configura el entorno de desarrollo en Android Studio y corre la aplicación en un emulador o dispositivo físico.

### 3. Backend (Django)

Para configurar y ejecutar el backend de administración con Django:

1. Navega al directorio `backend/django`:

    ```bash
    cd proyecto/backend/django
    ```

2. Crea un entorno virtual:

    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3. Instala las dependencias de Python:

    ```bash
    pip install -r requirements.txt
    ```

4. Configura la base de datos en `settings.py` con los datos de MySQL de XAMPP o Docker.

5. Ejecuta las migraciones de Django:

    ```bash
    python manage.py migrate
    ```

6. Inicia el servidor de desarrollo:

    ```bash
    python manage.py runserver
    ```

### 4. Backend (Spring Boot)

Para configurar y ejecutar el backend de usuario con Spring Boot:

1. Navega al directorio `backend/springboot`:

    ```bash
    cd proyecto/backend/springboot
    ```

2. Abre el proyecto en **IntelliJ IDEA** o tu IDE preferido para Java.

3. Configura la base de datos en `application.properties`  con los datos de MySQL de XAMPP o Docker.

4. Ejecuta el proyecto:

    ```bash
    ./mvnw spring-boot:run
    ```





   Gaaa 
