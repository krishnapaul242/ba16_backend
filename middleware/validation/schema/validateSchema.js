exports.validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validation = schema.validate(req.body, { abortEarly: false });
            if (validation.error) {
                let err = {};
                for (let i in validation.error.details) {
                    err[validation.error.details[i].context.key] = validation.error.details[i].message;
                }
                return res.status(400).json({
                    error: err,
                    status: 0
                });
            } else {
                if (!req.value) {
                    req.value = {};
                }
                req.value['body'] = validation.value;
                next();
            }
        } catch (err) {
            const error = new Error(err);
            next(error);
        }
    }
};

exports.validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validation = schema.validate(req.params, { abortEarly: false });
            if (validation.error) {
                let err = {};
                for (let i in validation.error.details) {
                    err[validation.error.details[i].context.key] = validation.error.details[i].message;
                }
                return res.status(400).json({
                    error: err,
                    status: 0
                });
            } else {
                if (!req.value) {
                    req.value = {};
                }
                req.value['params'] = validation.value;
                next();
            }
        } catch (err) {
            const error = new Error(err);
            next(error);
        }
    }
};
