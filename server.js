const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });

        // Spotify'ın veriyi gizlediği JSON bloğunu bul
        const start = response.data.indexOf('__NEXT_DATA__');
        const end = response.data.indexOf('</script>', start);
        const jsonString = response.data.substring(start + 22, end - 1);
        const data = JSON.parse(jsonString);

        // Şarkıları doğrudan veri ağacından çekiyoruz
        const items = data.props.pageProps.state.data.entity.tracks.items;
        const tracks = items.map(item => ({
            ad: item.track.name,
            sanatci: item.track.artists[0].name
        }));

        res.json({ tracks });
    } catch (error) {
        res.json({ error: "Veri yapısı değişmiş, şarkılar bulunamadı." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
