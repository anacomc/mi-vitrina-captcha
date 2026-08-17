const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para procesar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: LA PORTADA PRINCIPAL
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: PÁGINA DE GRACIAS 
// =====================================================================
app.get(['/gracias', '/gracias.html'], (req, res) => {
    // Servimos el HTML de forma normal para no trancar a FormSubmit
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CON CANDADO ANTI-TRAMPA (ESTRICTO)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Interceptamos de qué URL exacta viene el usuario (El Referer del navegador)
    const procedencia = req.headers.referer || "";
    const hostActual = req.headers.host || "";

    console.log(`📡 Intento de descarga. Procedencia detectada en RAM: [${procedencia}]`);

    // --- EL REMACHE MAESTRO DE HARDWARE ---
    // Si la procedencia no incluye tu propia página de gracias, significa que el usuario 
    // intentó saltarse el formulario o meterse escribiendo la URL directa. ¡BLOQUEADO!
    if (!procedencia.includes('/gracias') && !procedencia.includes('/gracias.html')) {
        console.log("⛔ FRAUDE DETECTADO: Intento de descarga directa o bypass de formulario. Portazo en la cara.");
        return res.status(403).send("Acceso Denegado: No está autorizado para realizar descargas directas sin registrarse.");
    }

    // Si pasó el candado de procedencia, se procede a transmitir el instalador real
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

// --- EL PORTERO ESTÁTICO SE QUEDA ABAJO PARA SERVIR EL LOGO.PNG ---
app.use(express.static(path.join(__dirname)));

// Inicializamos el puerto dinámico asignado por la infraestructura de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor unificado blindado operando en puerto " + PORT);
});
