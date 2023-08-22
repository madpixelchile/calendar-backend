
const { validationResult } = require('express-validator');

const validateEvents = (req, res = response, next) => {

    //Manejo de errores
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();

}

module.exports = {
    validateEvents
}