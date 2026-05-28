const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/api/playlist', async (req, res) => {
    const url = req.query.url;
    
    try {
        // Spotify'ın botları engellemesini aşmak için en yalın istek
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
            }
        });
        
        // Veriyi ham olarak döndürerek sunucu taraflı filtreleme hatasını yok ediyoruz
        res.json({ status: "success", data_received: true, length: response.data.length });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
