export default function handler(req, res) {
  res.status(200).json({
    message: 'Olá da função serverless!',
    timestamp: new Date().toISOString(),
  });
}
