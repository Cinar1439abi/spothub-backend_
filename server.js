const express = require('express');
const app = express();
const spotify = require('spotify-url-info')(require('axios')); // Bu kütüphane en sağlamıdır

const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL gerekli" });

    try {
        // Spotify linkini çözümle ve veriyi çek
        const data = await spotify.getData(url);
        
        // Şarkı listesini temizle ve gönder
        const tracks = data.trackList.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.status(500).json({ error: "Spotify bağlantısı reddedildi, IP bloklanmış olabilir." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
