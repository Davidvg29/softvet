const autenticarRoles = (allowedRoles) => {
    return (req, res, next) => {
        try {
          console.log(req);
          
            if (!allowedRoles.includes(req.empleado_softvet.nombre_rol)) {
                return res.status(403).json({ msg: 'Acceso prohibido. Rol no autorizado.' });
            }

            // Si todo es correcto, continuar con el siguiente middleware/controlador
            next();

        } catch (err) {
            // El error lanzado por verifyAndDecodeToken es capturado aquí.
            res.status(401).json({
                status: false,
                message: "Token inválido o expirado" 
                });
        }
    };
};

module.exports = { autenticarRoles };

