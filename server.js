const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    try {
        const { data } = await axios.get(playlistUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });

        // Şarkıları meta etiketlerinden yakalıyoruz (En sağlam yöntem)
        const regex = /<meta property="music:song" content="https:\/\/open\.spotify\.com\/track\/(.*?)">/g;
        let match;
        let trackIds = [];
        while ((match = regex.exec(data)) !== null) {
            trackIds.push(match[1]);
        }

        // Şimdilik test için ilk 5 şarkıyı çekelim
        const tracks = trackIds.slice(0, 5).map(id => ({
            ad: "Şarkı ID: " + id, 
            sanatci: "Spotify Web Üyesi"
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.status(500).json({ error: "Liste okunamadı." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu çalışıyor!"));
