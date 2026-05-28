const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    // Spotify ID'sini alıyoruz
    const playlistId = playlistUrl.split('playlist/')[1]?.split('?')[0];
    
    if (!playlistId) return res.json({ tracks: [] });

    try {
        // Spotify'ın açık API'sini kullanan güvenli bir proxy üzerinden veriyi alıyoruz
        const { data } = await axios.get(`developer.spotify.com0${playlistId}`);
        
        const tracks = data.tracks.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.json({ tracks: [], error: "Liste çekilemedi" });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
