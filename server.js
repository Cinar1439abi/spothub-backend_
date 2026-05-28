const express = require('express');
const { getDetails } = require('spotify-url-info')(require('axios'));
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    try {
        // Bu kütüphane, API anahtarı olmadan Spotify verisini çeken en güvenli yoldur.
        const data = await getDetails(url);
        const tracks = data.trackList.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));
        res.json({ tracks });
    } catch (e) {
        // Eğer burada hata alırsan, sunucunun IP'si gerçekten yasaklanmıştır.
        res.status(500).json({ error: "API anahtarı olmadan erişim engellendi." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
