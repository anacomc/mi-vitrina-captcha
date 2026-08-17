const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para procesar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: PORTADA PRINCIPAL (SIEMPRE FIJA Y EN VERDE)
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: PÁGINA DE GRACIAS (MANEJA LA REDIRECCIÓN DE FORMSUBMIT)
// =====================================================================
app.get(['/gracias', '/gracias.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CON CANDADO ESTRICTO ANTI-TRAMPA
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Interceptamos de qué URL exacta del planeta viene el usuario (El Referer)
    const procedencia = req.headers.referer || "";
    const hostActual = req.headers.host || "";

    console.log(`📡 Solicitud de descarga. Procedencia detectada: [${procedencia}]`);

    // --- EL CANDADO DE ACERO INOXIDABLE ---
    // Si la procedencia está vacía (usuario digitando en la barra) o NO incluye tu propio
    // dominio de Render, el servidor le mete un freno de mano violento en el acto.
    if (!procedencia.includes(hostActual) && !procedencia.includes('localhost')) {
        console.log("⛔ FRAUDE DETECTADO: Intento de bypass o descarga directa. Portazo.");
        return res.status(403).send("Acceso Denegado: No está autorizado para realizar descargas directas sin registrarse.");
    }

    // SI PASÓ EL FILTRO: Procedemos a transmitir los bytes puros de tu rifol.zip
    const rutaArchivoFisico = path.join(__dirname, 'rifol.zip'); 

    res.download(rutaArchivoFisico, 'rifol_demo.zip', (err) => {
        if (err) {
            console.error("❌ Error transmitiendo el instalador comprimido:", err);
            if (!res.headersSent) {
                res.status(500).send("El instalador no está disponible en este momento.");
            }
        }
    });
});

// --- EL PORTERO ESTÁTICO SE QUEDA RELEGADO ABAJO PARA SERVIR EL LOGO.PNG ---
app.use(express.static(path.join(__dirname)));

// Inicializamos el puerto dinámico asignado por la infraestructura de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor comercial unificado operando con éxito en puerto " + PORT);
});
