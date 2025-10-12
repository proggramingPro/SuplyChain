const express = require('express');
const router = express.Router();

// Calculate distance using Gemini API
router.post('/calculate-distance', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    // Use Gemini API for distance calculation
    const prompt = `Calculate the driving distance in kilometers between these two coordinates:
    Origin: ${origin.lat}, ${origin.lng}
    Destination: ${destination.lat}, ${destination.lng}
    
    Return only the distance number in kilometers as a JSON response with format: {"distance": number}`;

    try {
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          // Try to extract distance from response
          const distanceMatch = text.match(/(\d+\.?\d*)/);
          if (distanceMatch) {
            const distance = parseFloat(distanceMatch[1]);
            return res.json({ distance: Math.round(distance) });
          }
        }
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
    }

    // Fallback: Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const distance = Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    
    res.json({ distance });
  } catch (error) {
    console.error('Distance calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

module.exports = router;