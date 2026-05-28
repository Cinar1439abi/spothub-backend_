const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    // Çalma listesi ID'sini al
    const id = playlistUrl.split('playlist/')[1]?.split('?')[0];

    if (!id) return res.json({ error: "Geçersiz link" });

    try {
        // En garanti ve ücretsiz API servisi üzerinden veriyi çekiyoruz
        const response = await axios.get(`developer.spotify.com1${id}`);
        
        // Gelen veriyi uygulamana uygun formata çeviriyoruz
        const tracks = response.data.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));

        res.json({ tracks: tracks });
    } catch (e) {
        res.json({ tracks: [], error: "Sunucu bağlantı hatası" });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
