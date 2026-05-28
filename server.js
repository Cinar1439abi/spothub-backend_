const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    // Spotify linkinden ID'yi alıyoruz
    const id = url.split('playlist/')[1]?.split('?')[0];
    if (!id) return res.status(400).json({ error: "Geçersiz link" });

    try {
        // Bu sefer 'spotify-downloader-alternative' API'sini kullanıyoruz
        // Bu servis daha az engelleniyor
        const response = await axios.get(`https://spotify-downloader9.p.rapidapi.com/getPlaylistSongs?playlistId=${id}`, {
            headers: {
                'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
                'x-rapidapi-key': 'a25e63091cmsh700484bfd5b3ce3p12ec0ejsn89b71d4fd300' // Buraya RapidAPI'den ücretsiz bir anahtar alıp koyacaksın
            }
        });

        // Veriyi çek ve listeyi döndür
        const tracks = response.data.data.map(t => ({
            ad: t.title,
            sanatci: t.artist
        }));

        res.json({ tracks });
    } catch (error) {
        res.status(500).json({ error: "API bağlantısı yine reddedildi. Bir sonraki çözüm: Şarkı isimlerini Spotify linki yerine manuel metin olarak almak." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
