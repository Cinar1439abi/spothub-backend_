const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    // Spotify ID'sini ayıkla
    const id = url.split('playlist/')[1]?.split('?')[0];
    if (!id) return res.status(400).json({ error: "Geçersiz link" });

    try {
        // Artık doğrudan Spotify'a gitmiyoruz.
        // Halka açık, güvenli bir Spotify dönüştürücü API'sini kullanıyoruz.
        const response = await axios.get(`https://api.spotifydown.com/metadata/playlist/${id}`, {
            headers: { 'Origin': 'https://spotifydown.com', 'Referer': 'https://spotifydown.com/' }
        });

        const tracks = response.data.trackList.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));

        res.json({ tracks });
    } catch (error) {
        res.status(500).json({ error: "Sunucu bağlantı hatası: API engellendi." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
