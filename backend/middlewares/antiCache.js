//Anti-cache en APIs autenticadas
const antiCache = (req, res, next) => {
    // Para todas las respuestas de API
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Muy importante para proxies que cachean por URL
    res.setHeader('Vary', 'Cookie, Authorization, Origin');
    next();
}
module.exports = antiCache;
//Este middleware se usa en app.js para evitar que las respuestas de las APIs autenticadas sean cacheadas por el navegador o proxies.
//Se asegura de que las respuestas no se almacenen en caché, lo que es crucial para mantener la seguridad y la frescura de los datos en aplicaciones que requieren autenticación.
//Se debe incluir en el archivo app.js, justo antes de definir las rutas, para que se aplique a todas las respuestas de la API.
//Esto es especialmente importante en aplicaciones que manejan datos sensibles o que requieren autenticación