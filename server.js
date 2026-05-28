const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    
    // Spotify çalma listesi ID'sini linkten ayıklıyoruz
    const playlistId = playlistUrl.split('/').pop().split('?')[0];
    
    try {
        // Spotify'ın herkese açık (halka açık) veri çekme API'sini kullanıyoruz
        // Bu yöntem anahtar gerektirmez, doğrudan ham veriyi çeker
        const { data } = await axios.get(`https://api.spotify.com/v1/playlists/$${playlistId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Veri yapısı içerisinden şarkıları çekiyoruz
        const tracks = data.tracks.items.map(item => ({
            ad: item.track.name,
            sanatci: item.track.artists[0].name
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.status(500).json({ error: "API üzerinden liste çekilemedi. Lütfen linkin doğruluğunu kontrol et." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
