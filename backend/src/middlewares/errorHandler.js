const AppError = require("../errors/AppError");

function errorHandler(err, req, res, next) {

    // Erro nosso, com status definido (ex: 404, 400)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Erro de validação do Mongoose (tipo inválido, valor negativo...)
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    // Número duplicado (campo unique)
    if (err.code === 11000) {
        return res.status(409).json({
            error: "A Pokemon with this number already exists"
        });
    }

    // JSON malformado no body (o erro que você viu no PowerShell)
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON in request body" });
    }

    // Qualquer outra coisa é erro inesperado do servidor
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;