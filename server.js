const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para tragar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// Servimos las imágenes de la vitrina (como tu logo.png) de forma pública en la raíz
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
}); // <-- ¡AQUÍ ESTÁ EL CIERRE QUE FALTABA Y QUE CAUSABA EL ERROR!

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA BINARIA CIEGA (OCULTA EL ARCHIVO ZIP)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    const procedencia = req.headers.referer || "";

    // Seguridad de ráfaga: Si intentan descargar directo desde afuera, se les tranca el bit
    if (!procedencia.includes('/gracias') && !procedencia.includes(req.headers.host)) {
        console.log("⛔ Intento de descarga directa bloqueado por hardware.");
        return res.status(403).send("Acceso Denegado: No está autorizado para realizar descargas directas.");
    }

    // --- REPARADO: Apuntamos exactamente a tu archivo real 'rifol.zip' ---
    const rutaArchivoFisico = path.join(__dirname, 'rifol.zip'); 

    // Forzamos la descarga por búfer (Busca 'rifol.zip' en el disco, pero al usuario le baja como 'rifol_demo.zip')
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
    console.log(`🚀 Servidor comercial corriendo en el puerto ${PORT}`);
});
