module.exports = (fields) => (req, res, next) => {
    const errors = [];
    for (const [field, { regex, message }] of Object.entries(fields)) {
        const value = req.body[field];
        if (value === undefined || value === null || value === '') {
            errors.push({ field, message: `${field} is required` });
        } else if (regex && !regex.test(String(value))) {
            errors.push({ field, message });
        }
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }
    next();
};
