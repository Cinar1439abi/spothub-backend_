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

        // Şarkı adlarını ve sanatçıları yakalamak için daha hassas bir yöntem
        const regex = /"trackName":"(.*?)"/g;
        const artistRegex = /"artistName":"(.*?)"/g;
        
        let tracks = [];
        let match;
        
        // Şarkı ve sanatçı eşleşmelerini diziye al
        while ((match = regex.exec(response.data)) !== null) {
            let artistMatch = artistRegex.exec(response.data);
            tracks.push({
                ad: match[1],
                sanatci: artistMatch ? artistMatch[1] : "Sanatçı Bilinmiyor"
            });
        }

        res.json({ tracks: tracks });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => console.log("Sunucu devrede!"));
