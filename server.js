const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const playlistUrl = req.query.url;
    
    // Şarkıları çekmek için çok basit bir fetch yöntemi
    try {
        const { data } = await axios.get(playlistUrl);
        // Sayfa içeriğinden şarkı isimlerini basit bir regex ile ayıklıyoruz
        const titleMatch = data.match(/<title>(.*?)<\/title>/);
        res.json({ 
            status: "Sunucu Başarılı", 
            mesaj: "Sunucu aktif!",
            liste_adi: titleMatch ? titleMatch[1] : "Bilinmeyen Liste"
        });
    } catch (error) {
        res.status(500).json({ error: "Sunucu bağlantı kuramadı, lütfen linki kontrol et." });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu çalışıyor!"));
