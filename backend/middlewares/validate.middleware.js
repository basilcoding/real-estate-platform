export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        // 1. Log the raw error to your terminal so you can see what is actually failing!
        console.error("🔴 VALIDATION ERROR LOG:", error);

        // 2. Safely check if it's a Zod error (has an errors array) BEFORE mapping
        if (error && Array.isArray(error.errors)) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors.map(err => ({
                    path: err.path ? err.path.join('.') : 'unknown',
                    message: err.message
                }))
            });
        }

        // 3. If it is NOT a validation error, pass it to your global error handler
        next(error);
    }
};  