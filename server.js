const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// 1. LA PORTADA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. PÁGINA DE GRACIAS (TRAGA EL REBOTE SEGURO DE FORMSUBMIT)
app.get(['/gracias', '/gracias.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// 3. PROXY DE DESCARGA BINARIA (OCULTA EL ARCHIVO REAL DEL DISCO)
app.get('/ejecutar-descarga-segura', (req, res) => {
    console.log(`🚀 [${new Date().toISOString()}] DESCARGA - Transmitiendo bytes de rifol.zip desde la RAM del servidor...`);

    
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

// PORTERO ESTÁTICO DE RESPALDO PARA IMÁGENES
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor comercial operativo en puerto " + PORT);
});
