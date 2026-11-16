# Level-Up Gamer (React)

Frontend de la tienda Level-Up Gamer para Desarrollo Fullstack II (DSY1104). En la EP2 los datos
vivían en localStorage; desde la EP3 todo viene de la API REST en Spring Boot.

Backend: https://github.com/marioduoc/levelup-gamer-backend

Hecho por Mario Araus.

## Qué usé

- React + Vite
- react-router para las rutas
- react-bootstrap y Bootstrap para el diseño responsivo
- axios para hablar con la API (con interceptores para el token JWT)
- Vitest + Testing Library + jsdom para las pruebas

## Cómo correrlo

Primero tiene que estar arriba el backend en `http://localhost:8080`. Después:

```bash
npm install
npm run dev
```

Queda en http://localhost:5173. Vite redirige `/api` al backend, así que no hay problemas de CORS.

## Pruebas

```bash
npm run test:ejecutar    # corre todas las pruebas una vez
npm run test:cobertura   # corre y saca el informe de cobertura (coverage/index.html)
```

Las pruebas no necesitan el backend: la API se simula con `vi.mock`.

## Cómo está organizado

```
src/
  main.jsx         arranca la app dentro de AuthProvider
  App.jsx          carrito y rutas (públicas y protegidas por permiso)
  api/             cliente axios y una función por endpoint
  auth/            sesión, contexto, permisos por rol y RutaProtegida
  hooks/           useDatos: carga, error y reintento de una petición
  componentes/     piezas que se repiten (barra, tarjeta, grilla, etc)
  paginas/         una página por ruta
  paginas/admin/   panel de administración y de vendedor
  utils/           carrito, validaciones y formato
```

## Sesión y permisos

- Al iniciar sesión se guardan el access token y el refresh token en localStorage, así la sesión
  sigue después de recargar la página.
- Si el access token vence, el interceptor de axios pide uno nuevo con el refresh token y repite la
  petición sin que el usuario lo note. Si el refresh también vence, se cierra la sesión.
- `auth/permisos.js` define qué puede hacer cada rol. Lo usan el menú, los botones y las rutas.

| Rol | Ve |
|---|---|
| Visitante | tienda y carrito (para pagar debe iniciar sesión) |
| CLIENTE | tienda, carrito, checkout, mis compras |
| VENDEDOR | panel con productos y órdenes (solo lectura), sin carrito |
| ADMIN | todo: CRUD de productos, categorías, usuarios y órdenes |

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| admin@duoc.cl | Admin123! | ADMIN |
| vendedor@duoc.cl | Vendedor123! | VENDEDOR |
| cliente@gmail.com | Cliente123! | CLIENTE |

- Descuento Duoc (20%): cuentas con correo `@duoc.cl` o `@profesor.duoc.cl`.
- Pago simulado: cualquier tarjeta de 16 dígitos se aprueba, menos si termina en `0`.
