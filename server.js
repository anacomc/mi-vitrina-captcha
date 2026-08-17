const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para tragar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: PORTADA PRINCIPAL
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: ENTRADA DE GRACIAS TOTALMENTE LIBERADA (EVITA EL CONGELAMIENTO)
// =====================================================================
// Al remover el candado de referer, FormSubmit puede rebotar al usuario 
// de forma limpia a /gracias sin que el navegador bloquee la red.
app.get('/gracias', (req, res) => {
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// --- EL PORTERO ESTÁTICO SE QUEDA ABAJO PARA QUE NO INTERFIERA CON LAS IMÁGENES ---
app.use(express.static(path.join(__dirname)));

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CIEGA (OCULTA EL ARCHIVO ZIP)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Forzamos la descarga ciega por búfer. Al cliente le baja como 'rifol_demo.zip'
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

// Inicializamos el puerto dinámico asignado por la infraestructura de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor comercial inteligente operando en puerto " + PORT);
});
