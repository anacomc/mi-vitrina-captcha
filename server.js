const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para tragar payloads JSON planos de tus sistemas de escritorio
app.use(express.json());

// =====================================================================
// COMPUERTA 1: PORTADA PRINCIPAL (La subimos para que mande sobre el disco)
// =====================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: ENTRADA DE GRACIAS PURA (REPARADA PARA EVITAR EL BYPASS)
// =====================================================================
// Removemos el arreglo y dejamos que Express escuche estrictamente la subruta limpia.
// Esto obliga a que la petición de FormSubmit se procese en sus servidores primero.
app.get('/gracias', (req, res) => {
    // Entregamos el archivo físico legítimo del disco de Render
    res.sendFile(path.join(__dirname, 'gracias.html'));
});


// --- EL PORTERO ESTÁTICO SE QUEDA ABAJO PARA QUE NO SE INTERPONGA EN LAS RUTAS ---
app.use(express.static(path.join(__dirname)));

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

    // Ubicación física de tu instalador real adentro de la raíz de tu repositorio
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
    console.log("🚀 10. Servidor comercial unificado operando en puerto " + PORT);
});
