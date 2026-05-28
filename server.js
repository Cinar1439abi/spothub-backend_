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
        
        // Şarkı isimlerini sayfa kaynağından yakalayan basit mantık
        const trackMatches = data.match(/"trackName":"(.*?)"/g) || [];
        const artistMatches = data.match(/"artistName":"(.*?)"/g) || [];
        
        const tracks = trackMatches.map((t, i) => ({
            ad: t.replace(/"trackName":"/g, '').replace(/"/g, ''),
            sanatci: artistMatches[i] ? artistMatches[i].replace(/"artistName":"/g, '').replace(/"/g, '') : "Sanatçı Bilinmiyor"
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.status(500).json({ error: "Listeyi okurken hata oluştu." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu çalışıyor!"));
