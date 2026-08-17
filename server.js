const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para procesar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: LA PORTADA PRINCIPAL (CORREGIDA EN MINÚSCULAS)
// =====================================================================
app.get('/', (req, res) => {
    // Corregido: Llamamos al archivo real index.html en minúsculas
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: PÁGINA DE GRACIAS (MANEJA LA REDIRECCIÓN DE FORMSUBMIT)
// =====================================================================
app.get(['/gracias', '/gracias.html'], (req, res) => {
    console.log("📥 FormSubmit completado. Cargando gracias.html...");
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CIEGA (OCULTA EL ARCHIVO ZIP)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    console.log("🚀 Transmitiendo bytes de rifol.zip desde la RAM del servidor...");
    
    // Ubicación física de tu instalador real 'rifol.zip' en la raíz de tu GitHub
    const rutaArchivoFisico = path.join(__dirname, 'rifol.zip'); 

    // Forzamos la descarga por búfer. Al cliente le baja limpio como 'rifol_demo.zip'
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
