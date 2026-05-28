const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Sunucu aktif, Spotify verisi için beklemede...'));
app.listen(process.env.PORT || 10000);
