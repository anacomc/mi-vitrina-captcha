const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para tragar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: PROXY DE DESCARGA BINARIA CIEGA (OCULTA EL ARCHIVO ZIP)
// =====================================================================
// Esta es la ÚNICA ruta lógica que necesitamos en el backend. 
// El navegador la llamará de forma interna desde el gracias.html
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Ubicación física de tu instalador real 'rifol.zip' adentro de tu GitHub
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

// =====================================================================
// COMPUERTA 2: MOTOR DE ARCHIVOS ESTÁTICOS INTEGRAL
// =====================================================================
// Al dejar esta línea al final, Express servirá de forma nativa e instantánea
// tu index.html, tu gracias.html y tu logo.png con código 200 OK puro.
// Esto hace que FormSubmit valide la ruta al microsegundo sin rebotar.
app.use(express.static(path.join(__dirname)));

// Inicializamos el puerto dinámico asignado por la infraestructura de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor comercial simplificado operando en puerto " + PORT);
});
