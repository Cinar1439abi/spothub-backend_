const express = require('express');
const spotify = require('spotify-url-info')(require('axios'));
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    try {
        // Bu kütüphane "web scraping" değil, "metadata" sorgulama yapar
        // Spotify'ın bot korumasına takılmaz.
        const data = await spotify.getData(url);
        
        // Liste yapısını yakalıyoruz
        const tracks = data.trackList.map(item => ({
            ad: item.title,
            sanatci: item.artist
        }));

        res.json({ tracks: tracks });
    } catch (error) {
        res.status(500).json({ error: "Sunucu şarkı verisini çekemedi: " + error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
