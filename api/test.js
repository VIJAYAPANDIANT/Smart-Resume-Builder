module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Standalone API test successful',
    timestamp: new Date().toISOString()
  });
};
