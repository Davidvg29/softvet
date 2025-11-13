const autenticarRoles = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!allowedRoles.includes(req.empleado_softvet.nombre_rol)) {
                return res.status(403).json({ error: 'Acceso prohibido. Rol no autorizado.' });
            }
        } catch (err) {
            res.status(401).json({
                status: false,
                message: "Token inválido o expirado" 
                });
        }
    };
};

module.exports = { autenticarRoles };

