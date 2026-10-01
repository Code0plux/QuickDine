import { ZodError } from 'zod';

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: err.errors[0].message
            });
        }
        next(err);
    }
};

export default validate;
