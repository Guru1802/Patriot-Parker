// Reserve Parking Spot
app.post('/api/reserve', (req, res) => {
    const { userId, parkingSpotId } = req.body;
    const sqlCheck = 'SELECT * FROM parking_spots WHERE id = ? AND available_spots > 0';
    
    db.query(sqlCheck, [parkingSpotId], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(400).json({ message: 'No available spots' });

        const sqlReserve = 'INSERT INTO reservations (user_id, parking_spot_id) VALUES (?, ?)';
        db.query(sqlReserve, [userId, parkingSpotId], (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            
            const sqlUpdate = 'UPDATE parking_spots SET available_spots = available_spots - 1 WHERE id = ?';
            db.query(sqlUpdate, [parkingSpotId], (err, result) => {
                if (err) return res.status(500).json({ message: err.message });
                res.status(201).json({ message: 'Parking spot reserved successfully' });
            });
        });
    });
});
