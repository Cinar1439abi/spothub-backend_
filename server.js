const express = require('express');
const app = express();
app.use(express.json()); // JSON verisi kabul et
const PORT = process.env.PORT || 10000;

// Sunucu artık istek atmıyor, senin uygulamanın gönderdiği veriyi alıyor
app.post('/api/save-playlist', (req, res) => {
    const { tracks } = req.body; // Flutter'dan gelen şarkı listesi
    // Burada istediğin işlemi yapabilirsin (veritabanına kaydetme, indirme kuyruğu vb.)
    console.log("Veri alındı, toplam şarkı:", tracks.length);
    res.json({ status: "success", received: tracks.length });
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu pasif modda, veriyi bekliyor!"));
