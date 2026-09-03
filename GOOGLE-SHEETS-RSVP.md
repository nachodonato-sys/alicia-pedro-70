# Conectar el RSVP con Google Sheets

## 1. Crear la planilla
Creá una Google Sheet nueva.

Renombrá la primera pestaña como:

RSVP

En la fila 1 agregá estas columnas:

Fecha de respuesta | Nombre y apellido | Asistencia | Cantidad

## 2. Abrir Apps Script
En Google Sheets:

Extensiones → Apps Script

Borrá el código que aparece y pegá el contenido del archivo:

`google-apps-script.js`

## 3. Publicarlo
En Apps Script:

Implementar → Nueva implementación

Elegí:

- Tipo: Aplicación web
- Ejecutar como: Yo
- Quién tiene acceso: Cualquier persona

Tocá “Implementar”.

Google te va a dar una URL que termina en `/exec`.

## 4. Conectar la invitación
Abrí `script.js` y buscá:

`const RSVP_ENDPOINT = 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT';`

Reemplazalo por la URL `/exec` que te dio Google.

Ejemplo:

`const RSVP_ENDPOINT = 'https://script.google.com/macros/s/ABC123/exec';`

Guardá el archivo y volvé a subirlo a GitHub Pages.

A partir de ese momento, cada RSVP queda registrado automáticamente en la planilla.
