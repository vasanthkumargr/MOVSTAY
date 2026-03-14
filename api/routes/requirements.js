const express = require('express');
const axios = require('axios');
const router = express.Router();

const N8N_WEBHOOK = 'https://doc1.app.n8n.cloud/webhook-test/get-town-data';

// POST /api/requirements/shortlist
// Proxies the request to n8n to avoid browser CORS restrictions
router.post('/shortlist', async (req, res) => {
    try {
        const payload = req.body;
        console.log('📤 Forwarding to n8n:', JSON.stringify(payload).substring(0, 200));

        const n8nRes = await axios.post(N8N_WEBHOOK, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        console.log('✅ n8n responded with status:', n8nRes.status);
        // Log full response to understand exact structure
        console.log('📥 n8n FULL response:', JSON.stringify(n8nRes.data, null, 2).substring(0, 1000));

        // Normalize n8n response — it can come in many shapes:
        // { scores: [...] }  OR  [{ id, score, reason }]  OR  { output: { scores: [...] } }
        let scores = [];
        const data = n8nRes.data;

        if (Array.isArray(data)) {
            // flat array of scores
            scores = data;
        } else if (data && Array.isArray(data.scores)) {
            scores = data.scores;
        } else if (data && Array.isArray(data.output)) {
            scores = data.output;
        } else if (data && data.output && Array.isArray(data.output.scores)) {
            scores = data.output.scores;
        } else if (data && typeof data === 'object') {
            // Last resort: find any array inside the response
            const firstArr = Object.values(data).find(v => Array.isArray(v));
            if (firstArr) scores = firstArr;
        }

        console.log('✅ Normalized scores count:', scores.length);
        console.log('✅ First score sample:', JSON.stringify(scores[0]));

        return res.json({ scores });
    } catch (err) {
        if (err.response) {
            console.log('⚠️ n8n returned error status:', err.response.status, err.response.data);
            return res.json({ scores: [] });
        }
        console.error('❌ Error calling n8n:', err.message);
        res.status(500).json({ message: 'Failed to reach n8n webhook', scores: [] });
    }
});

module.exports = router;

