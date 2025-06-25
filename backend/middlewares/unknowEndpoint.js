const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
};

module.exports = unknownEndpoint;

