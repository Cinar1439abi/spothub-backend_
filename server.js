const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    
    try {
        // Kütüphanesiz, saf Axios ile Spotify önizleme sayfasına bağlanıyoruz
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        // Veriyi bulmak için sayfa içindeki JSON-LD (Schema.org) verisini çekiyoruz
        // Bu, Google'ın ve botların okuduğu "yasal" veridir.
        const regex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
        const match = response.data.match(regex);
        
        if (match) {
            const data = JSON.parse(match[1]);
            // Çalma listesiyse tracks, tek şarkıysa ayrı işleme
            const tracks = data.track ? [data.track] : data.itemListElement.map(item => ({
                ad: item.item.name,
                sanatci: item.item.byArtist[0].name
            }));
            
            res.json({ tracks });
        } else {
            res.json({ error: "Şarkı listesi bulunamadı (Sayfa yapısı gizli)." });
        }
    } catch (error) {
        res.status(500).json({ error: "İstek başarısız: " + error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
