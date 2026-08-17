const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para tragar payloads JSON planos de FoxPro/C#
app.use(express.json());

// Servimos las imágenes de la vitrina (como tu logo.png) de forma pública
app.use(express.static(path.join(__dirname)));

// =====================================================================
// COMPUERTA 1: ENTREGA DE LA PORTADA PRINCIPAL
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: ENTREGA DE GRACIAS (ANTI-TRAMPA POR ENTRADA DIRECTA)
// =====================================================================
app.get('/gracias', (req, res) => {
    const procedencia = req.headers.referer || "";

    // Si intentan escribir /gracias a mano en la barra del navegador, los rebota al inicio
    if (!procedencia.includes('formsubmit.co') && !procedencia.includes(req.headers.host)) {
        console.log("⛔ Acceso denegado a /gracias. Intento de salto de formulario.");
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, 'gracias.html'));
