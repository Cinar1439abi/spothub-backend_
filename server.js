const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    if (!playlistUrl) return res.status(400).json({ error: "URL eksik" });

    try {
        // Spotify'ın herkese açık Web Player verisini çekiyoruz (API anahtarı gerektirmez)
        const response = await axios.get(playlistUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // HTML içindeki gizli JSON verisini yakalıyoruz
        const match = response.data.match(/<script id="initial-state" type="text\/plain">(.*?)<\/script>/);
        if (!match) throw "Veri formatı tanınmadı.";

        const decoded = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
        
        // Şarkı listesini parse ediyoruz
        const tracks = decoded.data.entity.audioItems || [];
        const sarkiListesi = tracks.map(t => ({
            ad: t.title,
            sanatci: t.subtitle
        }));

        res.json({ tracks: sarkiListesi });
    } catch (error) {
        res.status(500).json({ error: "Spotify kısıtlaması nedeniyle liste çekilemedi." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu hazır!"));
