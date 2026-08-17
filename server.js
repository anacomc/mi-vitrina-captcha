const express = require('express');
const path = require('path');
const app = express();

// Middleware obligatorio para procesar payloads JSON planos
app.use(express.json());

// Guardaremos en la RAM del servidor los tokens de los usuarios autorizados que SÍ se registraron
const descargasAutorizadas = new Set();

// =====================================================================
// COMPUERTA 1: LA PORTADA PRINCIPAL INTELIGENTE
// =====================================================================
app.get('/', (req, res) => {
    const procedencia = req.headers.referer || "";

    // SI DETECTA QUE EL CLIENTE VIENE REBOTADO LEGÍTIMAMENTE DE FORMSUBMIT
    if (procedencia.includes('formsubmit.co')) {
        // Generamos una llave única aleatoria para esta descarga en la RAM
        const tokenSecreto = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        
        // Registramos la llave en nuestro búnker temporal del servidor
        descargasAutorizadas.add(tokenSecreto);
        console.log(`✅ Registro exitoso en FormSubmit. Token generado en RAM: [${tokenSecreto}]`);

        // Le inyectamos el token a la URL de gracias de forma interna y transparente
        return res.redirect(`/gracias?llave=${tokenSecreto}`);
    }

    // Si entró normal digitando la URL de la vitrina, le muestra el index.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================================
// COMPUERTA 2: PÁGINA DE GRACIAS CONTROLADA (MANEJA LA COINCIDENCIA)
// =====================================================================
app.get(['/gracias', '/gracias.html'], (req, res) => {
    // Entregamos el HTML limpio. El gracias.html capturará el token de la URL
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// =====================================================================
// COMPUERTA 3: PROXY DE DESCARGA CON CANDADO DE TOKEN ÚNICO (DESTRUIBLE)
// =====================================================================
app.get('/ejecutar-descarga-segura', (req, res) => {
    // Capturamos el token que le mandó el gracias.html
    const tokenCliente = req.query.token || "";

    console.log(`📡 Intento de descarga binaria con Token: [${tokenCliente}]`);

    // --- EL REMACHE SUPREMO DE ACERO ---
    // Si el token no existe en nuestra lista de la RAM, significa que el usuario 
    // intentó escribir la URL a mano o saltarse el FormSubmit. ¡BLOQUEADO!
    if (!tokenCliente || !descargasAutorizadas.has(tokenCliente)) {
        console.log("⛔ FRAUDE DETECTADO: Intento de descarga sin registro o token inválido. Portazo en la cara.");
        return res.status(403).send("Acceso Denegado: No está autorizado para realizar descargas directas sin registrarse.");
    }

    // ¡ÉXITO! El token es válido. Lo BORRAMOS inmediatamente de la RAM para que nadie pueda re-usar el mismo link
    descargasAutorizadas.delete(tokenCliente);
    console.log(`🔥 Token [${tokenCliente}] destruído de la RAM con éxito. Descarga autorizada.`);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor unificado blindado operando en puerto " + PORT);
});
