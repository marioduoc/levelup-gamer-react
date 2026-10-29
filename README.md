# Level-Up Gamer (React)

Tienda gamer para la Evaluación 2 de Desarrollo Fullstack II (DSY1104). Es la misma tienda
que hice en la EP1 con HTML, CSS y JS, pero ahora pasada a React con Vite. Tiene navegación,
formularios con validación, diseño responsivo con Bootstrap y pruebas con Vitest.

Hecho por Mario Araus.

## Qué usé

- React + Vite
- react-router para las rutas
- react-bootstrap y Bootstrap para el diseño responsivo
- Vitest + Testing Library + jsdom para las pruebas
- localStorage como "base de datos" mientras no haya backend (eso queda para la EP3)

## Cómo correrlo

```bash
npm install
npm run dev
```

Queda en http://localhost:5173

## Pruebas

```bash
npm run test:ejecutar    # corre todas las pruebas una vez
npm run test:cobertura   # corre y saca el informe de cobertura (coverage/index.html)
```

## Cómo está organizado

```
src/
  main.jsx         arranca la app
  App.jsx          estado compartido (carrito, sesión) y las rutas
  componentes/     piezas que se repiten (barra, tarjeta, grilla, etc)
  paginas/         una página por ruta
  datos/           los datos y el CRUD sobre localStorage
  utils/           lógica suelta: carrito, validaciones, pago
```

Las pruebas (`*.test.jsx`) van al lado del archivo que prueban.

## Datos para probar

- Descuento Duoc (20%): registrarse con un correo `@duoc.cl`.
- RUN válido de ejemplo: `123456785`.
- Pago simulado: cualquier tarjeta de 16 dígitos se aprueba, menos si termina en `0`
  (ahí sale la pantalla de pago rechazado).
