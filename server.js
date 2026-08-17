const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para procesar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: LA PORTADA PRINCIPAL (ELIMINA EL 'NOT FOUND' DE LA RAÍZ)
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: PÁGINA DE GRACIAS (MANEJA LA REDIRECCIÓN DE FORMSUBMIT)
// =====================================================================
// Atiende tanto la subruta limpia como la estática con la extensión .html
app.get(['/gracias', '/gracias.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CIEGA (OCULTA EL ARCHIVO ZIP)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Ubicación física de tu instalador real 'rifol.zip' en la raíz de tu GitHub
    const rutaArchivoFisico = path.join(__dirname, 'rifol.zip'); 
    console.log("🚀 Solicitud de ejecutar-descarga-segura " + rutaArchivoFisico);
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

// --- EL PORTERO ESTÁTICO SE QUEDA ABAJO PARA SERVIR EL LOGO.PNG SIN INTERFERIR EN LAS COMPUERTAS ---
app.use(express.static(path.join(__dirname)));

// Inicializamos el puerto dinámico asignado por la infraestructura de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor comercial unificado operando con éxito en puerto " + PORT);
});
