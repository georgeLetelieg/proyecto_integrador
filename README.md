Planificación de proyecto integrador mas desarrollo por etapas:

Etapa 1 — Base - Conexión Firebase + Auth + usuarios con roles
Etapa 2 — Huertos - CRUD de huertos y asignación de trabajadores
Etapa 3 — Temporadas y recolecciones - registro de trabajo diario
Etapa 4 — Pagos - cálculo y registro de pagos por periodo
Etapa 5 — Fichas - expediente del trabajador con historial
Etapa 6 — Vue.js - frontend conectado al backend

--------------------------------------------------------------------------


Etapa 1 — Base - Conexión Firebase + Auth + usuarios con roles

1.- Creamos el proyecto con:
    npm init -y
2.- Instalamos Express: (Framework minimalista que permite escribir codigo mas rapido)
    npm install express
3.- Creamos el gitignore agregando el .env y el node_modules/
4.- Crearemos la estructura de carpetas de forma manual usando el comando mkdir
    mkdir src
    mkdir src/routes src/controllers src/middlewares
4.1.- Verificamos que las carpetas esten creadas
5.- Creaciónm de nuestro primer arvhico index.js "Notar que ahora la extencion ha cambiado de .html a .js"
5.1.- ¿Qué es app.get()?
        Es un método de Express que dice: "cuando alguien haga una petición GET a la ruta '/', ejecuta esta función".
        Recibe dos cosas:

        La ruta → '/' (la raíz de tu servidor)
        Una función que se ejecuta cuando alguien entra a esa ruta
6.- Levanatar el servidor:
        node src/index.js
7.- Instalar nodemon:
        npm install -D nodemon
8.- Creación del Script en package.json
    pasamos de esto:
        "test": "echo \"Error: no test specified\" && exit 1"
    a esto:
        "start": "node src/index.js",
        "dev": "nodemon src/index.js"
9.-Comenzamos con la integracion de una base de datos, en este caso estaremos usando firebase(Revisar documentación oficial)
9.1- Instalacion de firebase:
    npm install firebase
10.-A continuación vamos a instalar nuevamente firebase, pero agregando el dotenv
    npm install firebase-admin dotenv
11.- Creamos el arvichoi .env en nuestra raiz del proyecto
11.-Agaregamos el puerto y la credencial de Google:
    PORT=3000
    GOOGLE_APPLICATION_CREDENTIALS=./src/config/proyectointegrador....
12.- Creacion del controlador, para este paso nos ubicaremos dentro de la carpeta src/controllers/
   y crearemos el archivo de nombre "auth.controller.js"
13.-Creamos el manejo de rutas este archivo "auth.routes.js" lo crearemos en src/routes/
    y lo importamos en nmuestro index.js, hasta este punto solo estamos viendo el login y el register
14.-Abrimos Postman y con el metodo POST mandaremos la URL:
    http://localhost:3000/auth/registro
14.1.-Como primer paso sera enviar el siguente raw para administrador
    {
        "nombre": "Juan Admin",
        "email": "juan@gmail.com",
        "password": "123456",
        "rol": "admin",
        "tipo_documento": "rut",
        "numero_documento": "12.345.678-9",
        "fecha_nacimiento": "1985-03-15",
        "telefono": "+56912345678"
    }
14.2.-ahora para el dueño de fundo:
    {
        "nombre": "Carlos Dueño",
        "email": "carlos@gmail.com",
        "password": "123456",
        "rol": "dueño",
        "tipo_documento": "rut",
        "numero_documento": "15.678.432-5",
        "fecha_nacimiento": "1978-06-10",
        "telefono": "+56934567890"
    }
14.3.- El resultado que nos arroja sera:
    {
        "mensaje": "Usuario creado correctamente",
        "uid": "kULPf8k7uDWdbXAVm7UFk1bCAon2"
    }
14.4.-el resultado para el dueño sera:
    {
        "mensaje": "Usuario creado correctamente",
        "uid": "7dEsTtmvYqXzigPqXQL2MPLCPqG3"
    }
15.- Iniciar sesion, para este paso vamos a abrir postman y creamos una peticion POST nuevamente con los siguentes datos
    {
        "email": "juan@gmail.com",
        "password": "123456"
    }
15.1.- lo que nos mostrara:
    {
        "mensaje": "Login exitoso",
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc3Nzc3NDQzMSwiZXhwIjoxNzc3Nzc4MDMxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0Bwcm95ZWN0b2ludGVncmFkb3ItM2NjOTEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0Bwcm95ZWN0b2ludGVncmFkb3ItM2NjOTEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiI0MWlsMUNjZ3M3T2JnaGhEbUlwdlRaNGlKTk8yIn0.XCA8i5-zrd6UT4DU0jQz05-Rc8K_PolFx0mv_QOxq3MczmRogTwUf2zyKusZ7prCknQ4vA-UX7EDnrDi-e4fygvM60nHDpNpznnbKmr0dBURpCeco_ioG4cG9ZVsaVs3Eh70HYGNsRytpxjdJkgY5J1tyCdoZhRAX1_EHXHz2puBBoZphD5EY-xCRpSU-UKJRs4xpDV4cv7zEeE9X8R2_UNiUbXqwSlV50mQ3N0i8YJyG_Njtlbsg368XJfp5Lxcx5R-oC6U0LYnQ8kykzIX7tYWSzS2MLD1K6QVK3xQCaRxpzIkzNkb78_XoXbOk0WHTEN7OYvbfWD2o88gOlOA0w",
        "usuario": {
            "uid": "41il1Ccgs7ObghhDmIpvTZ4iJNO2",
            "nombre": "Juan Admin",
            "email": "juan@gmail.com",
            "rol": "admin"
        }
    }
16.-Creación de moddleware, vamos a configurar el token
    creamos un nuevo documento "auth.middleware.js" en middleware
16.1.- vamos a verificar los roles creando en la misma carpeta src/middleware
    creando el siguente archivo "roles.middleware.js"


--------------------------------------------------------------------------

Etapa 2 — Huertos - CRUD de huertos y asignación de trabajadores

1.- Ahora creqamos el huertos.controller
2.- Para este punbto vamos a crear el huertos.routes.js
3.- Como anterior mente llamamos al Auth en el index ahora debemos hacer lo mismo para el el huerto:
    app.use('/huertos', huertoRoutes);
4.- Como vamos a probar esto?
4.1.- Iniciamos sesion con el el usuario en el postman:
    {
        "email": "juan@gmail.com",
        "password": "123456"
    }
4.2.- Copiamos el uid y lo agregamos en bearer token, luego vamos a la ruta
    http://localhost:3000/huertos y agregamos un nuevo huerto:
    {
        "nombre": "Huerto Los Aromos",
        "ubicacion": "Parral, Chile"
    }
5.- Para obtener los huertos creados vamos a la siguente ubicacion
    GET http://localhost:3000/huertos
6.- Para eliminar los huertos vamos a cambiar el metodo de get a Delete mantenemos el incio de la URL pero
    agregamos el id del huerto creado, quedando asi la url http://localhost:3000/huertos/DvjevQ8bbq9jCLQ1bhir
7.- Lo que nos toca crear a continuacion es agregar al trabajor a cada huerto
    para ello vamos a agregar "asignarTrabajador" y "desasignarTrabajador" dentro de huertos.controller
    finalmente para no tener errores exportamos los dos nuevos metodos en el module.export
8.- Una vcez agregado debemos incluirlos en el huertos.routes para poder usar esos metodos
    quedandonos de esta forma:
        const { 
            crearHuerto, 
            obtenerHuertos, 
            obtenerHuertoPorId, 
            editarHuerto, 
            eliminarHuerto,
            asignarTrabajador,
            desasignarTrabajador
        } = require('../controllers/huertos.controller');
9.- ¿Como vamos a probar todo esto?
    Crearemos un trabajador desde 0, guartdando el uid que nos devuelve,
    el primer paso es ir a postman y en la URL de registro agregamos lo siguente:
    Paso 1:
    Agregar URL y JSON
    POST http://localhost:3000/auth/registro
    {
        "nombre": "Pedro Trabajador",
        "email": "pedro@gmail.com",
        "password": "123456",
        "rol": "trabajador",
        "tipo_documento": "rut",
        "numero_documento": "98.765.432-1",
        "fecha_nacimiento": "1995-07-20",
        "telefono": "+56987654321",
        "nacionalidad": "chileno",
        "tipo_contrato": "con_contrato"
    }
    uid del trabajador: ssNeLKZsqPaWRcYuBnlZxzDxpQK2

    Error, Falta iniciar la sesion

    Paso 2:
    Ingresamos con login de carlos
    POST http://localhost:3000/auth/login
    Login de carlos:
    {
        "email": "carlos@gmail.com",
        "password": "123456"
    }
    uid de carlos: 7dEsTtmvYqXzigPqXQL2MPLCPqG3

    Paso 3:
    Agregamos el Huerto
    POST http://localhost:3000/huertos 
    Agregamos el JSON:
    {
        "nombre": "Huerto Los Aromos",
        "ubicacion": "Chillan, Chile"
    }
    Response:
    {
        "mensaje": "Huerto creado correctamente",
        "id": "R910NG5uBE0zTivZn7V6"
    }

    Paso 4:
    POST http://localhost:3000/huertos/<id del huerto>/asignar
    JSON:
    {
        "trabajadorId": "<uid del trabajador>"
    }
    Response:
    {
        "id": "R910NG5uBE0zTivZn7V6",
        "nombre": "Huerto Los Aromos",
        "ubicacion": "Chillan, Chile",
        "duenoId": "7dEsTtmvYqXzigPqXQL2MPLCPqG3",
        "creadoEn": "2026-05-04T00:49:56.202Z",
        "trabajadorActivoId": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2"
    }

    Paso 5:
    GET http://localhost:3000/huertos/<id del huerto>
    Response:
    {
        "id": "R910NG5uBE0zTivZn7V6",
        "nombre": "Huerto Los Aromos",
        "ubicacion": "Chillan, Chile",
        "duenoId": "7dEsTtmvYqXzigPqXQL2MPLCPqG3",
        "creadoEn": "2026-05-04T00:49:56.202Z",
        "trabajadorActivoId": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2"
    }

--------------------------------------------------------------------------

Etapa 3 — Temporadas y recolecciones - registro de trabajo diario

1.- Creación de temporadasController, primero crearemos el controlador, en la caprtea correspondiente
2.- Creación de temporadasRutes, en la carpeta correspondiente
3.- Ahora pasamos a las pruebas de forma inmediata:
    Paso 1 Login:
        POST http://localhost:3000/auth/login
        JSON:
            {
                "email": "carlos@gmail.com",
                "password": "123456"
            }
        Response:
            "uid": "7dEsTtmvYqXzigPqXQL2MPLCPqG3"
    Paso 2 Crear Temporada:
        Agregar El token: 7dEsTtmvYqXzigPqXQL2MPLCPqG3
        POST http://localhost:3000/temporadas
        JSON:
            {
                "huertoId": "<id del huerto creado antes>",
                "fruta": "Manzana",
                "fechaInicio": "2026-05-01"
            } R910NG5uBE0zTivZn7V6
        Response:
            {
                "mensaje": "Temporada creada correctamente",
                "id": "ACpBcRZYanB8c52Z6cDu"
            }
    Paso 3 Listar Temporada:
        GET http://localhost:3000/temporadas
        Response:
            {
                "id": "ACpBcRZYanB8c52Z6cDu",
                "huertoId": "R910NG5uBE0zTivZn7V6",
                "fruta": "Manzana",
                "fechaInicio": "2026-05-01",
                "fechaFin": null,
                "estado": "activa",
                "creadoPor": "7dEsTtmvYqXzigPqXQL2MPLCPqG3",
                "creadoEn": "2026-05-04T01:15:04.920Z"
            }


--------------------------------------------------------------------------

Etapa adicional, gestion de usuarios:
1.- Se crea el controlador y el routes, estos se agregan al index
2.- Pruebas en postMan:
    Paso 1 Login de admin:
        {
            "email": "juan@gmail.com",
            "password": "123456"
        }
        uid: kULPf8k7uDWdbXAVm7UFk1bCAon2
    Paso 2 obtenemos a los usuarios:
    GET http://localhost:3000/usuarios
    [
        {
            "id": "41il1Ccgs7ObghhDmIpvTZ4iJNO2",
            "uid": "41il1Ccgs7ObghhDmIpvTZ4iJNO2",
            "nombre": "Juan Admin",
            "email": "juan@gmail.com",
            "rol": "admin",
            "creadoEn": "2026-05-03T02:11:27.719Z"
        },
        {
            "id": "7dEsTtmvYqXzigPqXQL2MPLCPqG3",
            "uid": "7dEsTtmvYqXzigPqXQL2MPLCPqG3",
            "nombre": "Carlos Dueño",
            "email": "carlos@gmail.com",
            "rol": "dueño",
            "tipo_documento": "rut",
            "numero_documento": "15.678.432-5",
            "fecha_nacimiento": "1978-06-10",
            "telefono": "+56934567890",
            "creadoEn": "2026-05-03T02:45:21.022Z"
        },
        {
            "id": "kULPf8k7uDWdbXAVm7UFk1bCAon2",
            "uid": "kULPf8k7uDWdbXAVm7UFk1bCAon2",
            "nombre": "Juan Admin",
            "email": "juan@gmail.com",
            "rol": "admin",
            "creadoEn": "2026-05-03T02:34:31.059Z"
        },
        {
            "id": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2",
            "uid": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2",
            "nombre": "Pedro Trabajador",
            "email": "pedro@gmail.com",
            "rol": "trabajador",
            "tipo_documento": "rut",
            "numero_documento": "98.765.432-1",
            "fecha_nacimiento": "1995-07-20",
            "telefono": "+56987654321",
            "creadoEn": "2026-05-04T00:48:00.606Z",
            "nacionalidad": "chileno",
            "tipo_contrato": "con_contrato"
        }
    ]
    Paso 3 obtenemos usuario por ID
    GET http://localhost:3000/usuarios/<uid del trabajador>
    {
        "id": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2",
        "uid": "ssNeLKZsqPaWRcYuBnlZxzDxpQK2",
        "nombre": "Pedro Trabajador",
        "email": "pedro@gmail.com",
        "rol": "trabajador",
        "tipo_documento": "rut",
        "numero_documento": "98.765.432-1",
        "fecha_nacimiento": "1995-07-20",
        "telefono": "+56987654321",
        "creadoEn": "2026-05-04T00:48:00.606Z",
        "nacionalidad": "chileno",
        "tipo_contrato": "con_contrato"
    }

--------------------------------------------------------------------------

Etapa 4 — Pagos - cálculo y registro de pagos por periodo

1.- Se crea el controlador y el routes, estos se agregan al index



--------------------------------------------------------------------------

Front-end

1.- Creamos erl cliente con un template de vue.js
    npm create vite@latest client -- --template vue
2.- Damos que si a todo y entramos a http://localhost:5173/
3.- Agregamos pinia
    npm install vue-router pinia axios
4.- Entramos a client y inbstalamos axios con el comando:
    npm install vue-router pinia axios
