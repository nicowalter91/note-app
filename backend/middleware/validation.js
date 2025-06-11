const Joi = require('joi');

// Validierungsschemas
const schemas = {
    createUser: Joi.object({
        fullName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Der Name muss mindestens 2 Zeichen lang sein',
                'string.max': 'Der Name darf maximal 50 Zeichen lang sein',
                'any.required': 'Der Name ist erforderlich'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
                'any.required': 'Die E-Mail-Adresse ist erforderlich'
            }),
        password: Joi.string()
            .min(6)
            .max(100)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
            .required()
            .messages({
                'string.min': 'Das Passwort muss mindestens 6 Zeichen lang sein',
                'string.max': 'Das Passwort darf maximal 100 Zeichen lang sein',
                'string.pattern.base': 'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten',
                'any.required': 'Das Passwort ist erforderlich'
            })
    }),

    loginUser: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
                'any.required': 'Die E-Mail-Adresse ist erforderlich'
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Das Passwort ist erforderlich'
            })
    })
};

// Validierungsmiddleware
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({
                error: true,
                message: 'Validierungsschema nicht gefunden'
            });
        }

        const { error } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true 
        });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));
            
            return res.status(400).json({
                error: true,
                message: 'Validierungsfehler',
                errors
            });
        }

        next();
    };
};

module.exports = {
    validateRequest
};
