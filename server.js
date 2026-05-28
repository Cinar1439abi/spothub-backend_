const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000; // Render için port ayarı esnekleştirildi

app.use(express.json());

// Spotify geliştirici şifrelerin (Güvenli Sunucu Katmanı)
const CLIENT_ID = "699674f71fac42c98e88fc67397d1a6a";
const CLIENT_SECRET = "6bc2bf5e8c364be4b8b7c0c6f9bd4721";

// 1. Spotify'dan Resmi Access Token Alan Fonksiyon
async function getSpotifyToken() {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials', 
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Spotify Token Alınamadı:", error.message);
        return null;
    }
}

// 2. Flutter'ın İstek Atacağı Gerçek API Uç Noktamız
app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    if (!playlistUrl) return res.status(400).json({ error: "URL eksik" });

    try {
        const match = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
        if (!match) return res.status(400).json({ error: "Geçersiz Spotify Linki" });
        const playlistId = match[1];

        const token = await getSpotifyToken();
        if (!token) return res.status(500).json({ error: "Spotify bağlantı izni alınamadı" });

        // Spotify Resmi API'sinden çalma listesi şarkılarını çekiyoruz
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const sarkiListesi = spotifyResponse.data.items.map(item => {
            if (item.track) {
                return {
                    ad: item.track.name,
                    sanatci: item.track.artists[0] ? item.track.artists[0].name : "Bilinmeyen Sanatçı"
                };
            }
            return null;
        }).filter(Boolean);

        res.json({ tracks: sarkiListesi });

    } catch (error) {
        console.error("Sunucu Hatası:", error.message);
        res.status(500).json({ error: "Spotify listesi çekilirken sunucu hatası oluştu" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpotHub Arka Plan Sunucusu ${PORT} portunda başarıyla çalışıyor!`);
});
