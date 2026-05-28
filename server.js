const express = require('express');
const axios = require('axios');
const spotify = require('spotify-url-info')(axios);
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL gerekli" });

    try {
        // Axios ile veriyi çekiyoruz
        const response = await axios.get(url);
        
        // Veriyi manuel olarak kütüphaneye gönderiyoruz
        // .getData yerine doğrudan embed'i kullanıyoruz
        const data = await spotify.getPreview(url);
        
        // Playlist ise tüm listeyi, değilse tek şarkıyı döndür
        const tracks = data.trackList ? data.trackList : [data];
        
        res.json({ 
            tracks: tracks.map(t => ({
                ad: t.title,
                sanatci: t.artist
            }))
        });
    } catch (error) {
        // Hata durumunda en azından nedenini görelim
        res.status(500).json({ error: "İşlem başarısız: " + error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
