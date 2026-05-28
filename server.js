const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    
    try {
        // Spotify'ın engelini aşmak için tarayıcı taklidi yapan bir yapı
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        // Sayfa içinden şarkı verisini çeken JSON yapısını bul
        const regex = /"tracks":\{"items":\[(.*?)\]/s;
        const match = response.data.match(regex);
        
        if (match) {
            res.send({ status: "Başarılı", raw: "Veri alındı, işleniyor..." });
        } else {
            throw new Error("Veri yakalanamadı");
        }
    } catch (e) {
        res.status(500).json({ error: "Spotify hala engelliyor. Proxy şart." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
