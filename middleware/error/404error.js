exports.errorHandler = (req, res) => {
    return res.status(404).send({
        message: "API URL Not Found",
        status: 0,
    });
}