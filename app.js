

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

//Read Patriot_Parker.sql file
const ppFile = path.join(__dirname, '..', 'database', 'Patriot_Parker.sql');
const sqlStatements = fs.readFileSync(ppFile, 'utf-8');

//Create a MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1', //localhost gave me weird issues
  user: 'root',
  password: '', //type your mySQL password here -> i will figure out a better implementation of this later
  database: 'Patriot_Parker'
});

//Split all SQL statements (executing all at once caused issues that I'm not sure how to quite fix, but this worked enough for now)
const statements=sqlStatements.split(';');

//Execute each SQL statement separately
const executeStatements = (index) => {
  if (index >= statements.length) {
    console.log('SQL statements executed successfully');
    
    //Start the server after executing all SQL statements
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
    return;
  }
  
  const statement = statements[index].trim();
  
  if (statement) {
    connection.query(statement, (err, results) => {
      if (err) {
        console.error('Error executing SQL statement:', err);
        return;
      }
      executeStatements(index + 1);
    });
  } else {
    executeStatements(index + 1);
  }
};

executeStatements(0);

//getters from database
//most methods require ID for either the parking location or the user
//=====================================================================//
//                             PARKING                                 //
//=====================================================================//
/*
    1 - Lot A
    2 - Lot K
    3 - Lot M

    4 - Rappahannock Deck
    5 - Rappahannock Deck
    6 - Rappahannock Deck

    7 - Shenandoah Deck
    8 - Shenandoah Deck
    9 - Shenandoah Deck
*/
//Get all parking locations
//RETURN: JSON array of all parking location objects
app.get('/parking-locations', (req, res) => {
  const query = 'SELECT * FROM Parking_Location';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.status(200).json(results);
  });
});

//Get specific parking location w/ ID
//RETURN: JSON object of a specific parking location
app.get('/parking-locations/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM Parking_Location WHERE lot_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Parking location not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

//Get # of spots available for a parking location by lot_id
//RETURN: JSON object with the # available spots for a specific parking location
//{ "spots_available": 500 }
app.get('/parking-locations/:id/spots-available', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT spots_available FROM Parking_Location WHERE lot_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Parking location not found' });
      } else {
        res.status(200).json({ spots_available: results[0].spots_available });
      }
    });
  });
  
//Get total # of spots for a parking location by lot_id
//RETURN: JSON object with the total # spots of a specific parking location
//{ "total_spots": 2500 }
app.get('/parking-locations/:id/total-spots', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT total_spots FROM Parking_Location WHERE lot_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Parking location not found' });
      } else {
        res.status(200).json({ total_spots: results[0].total_spots });
      }
    });
});
  
//Check if a parking location is a deck by lot_id
//RETURN: JSON object indicating if a specific parking location is a deck
//{ "is_deck": true }
app.get('/parking-locations/:id/is-deck', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT is_it_deck FROM Parking_Location WHERE lot_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Parking location not found' });
      } else {
        res.status(200).json({ is_deck: results[0].is_it_deck === 1 });
      }
    });
});
  
//Check if a parking location is full by lot_id
//RETURN: JSON object indicating if a specific parking location is full
//{ "is_full": false }
app.get('/parking-locations/:id/is-full', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT is_full FROM Parking_Location WHERE lot_id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'Parking location not found' });
      } else {
        res.status(200).json({ is_full: results[0].is_full === 1 });
      }
    });
});

//Update spots_available for a parking location by lot_id (increment)
//Automatically changes "is_full" accordingly
//RETURN: JSON object indicating if spots available incremented successfully, throws error otherwise
// { "message": "Spots available incremented successfully" }
app.put('/parking-locations/:id/increment-spots', (req, res) => {
  const { id } = req.params;
  
  const query = 'UPDATE Parking_Location SET spots_available = spots_available + 1, is_full = (spots_available + 1 = total_spots) WHERE lot_id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Parking location not found' });
    } else {
      res.status(200).json({ message: 'Spots available incremented successfully' });
    }
  });
});

//Update spots_available for a parking location by lot_id (decrement)
//Automatically changes "is_full" accordingly
//RETURN: JSON object indicating if spots available decremented successfully, throws error otherwise
// { "message": "Spots available decremented successfully" }
app.put('/parking-locations/:id/decrement-spots', (req, res) => {
  const { id } = req.params;
  
  const query = 'UPDATE Parking_Location SET spots_available = spots_available - 1, is_full = (spots_available - 1 = 0) WHERE lot_id = ? AND spots_available > 0';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Parking location not found or no available spots' });
    } else {
      res.status(200).json({ message: 'Spots available decremented successfully' });
    }
  });
});

//=====================================================================//
//                               USERS                                 //
//=====================================================================//

//Get all users
//RETURN: JSON array of all user objects
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM User_info';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    res.status(200).json(results);
  });
});

//Get specific user w/ ID
//RETURN: JSON object representing a specific user
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM User_info WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });

//Get license plate for a user by net_id
//RETURN: JSON object with license plate for a specfic user (by net_id)
//{ "license_plate": "UUL9900" }
app.get('/users/net-id/:netId/license-plate', (req, res) => {
  const { netId } = req.params;
  
  const query = 'SELECT license_plate FROM User_info WHERE net_id = ?';
  connection.query(query, [netId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ license_plate: results[0].license_plate });
    }
  });
});

//Get check-in time for a user by net_id
//RETURN: JSON object with the check-in time for a specfic user (by net_id)
//{ "checkin_time": "2021-06-01T00:00:00.000Z" }
app.get('/users/net-id/:netId/checkin-time', (req, res) => {
  const { netId } = req.params;
  
  const query = 'SELECT checkin_time FROM User_info WHERE net_id = ?';
  connection.query(query, [netId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const checkinTime = results[0].checkin_time;
      const formattedTime = checkinTime ? new Date(checkinTime * 1000).toISOString() : null;
      res.status(200).json({ checkin_time: formattedTime });
    }
  });
});

//Get person role for a user by net_id
//RETURN: JSON object with the person role for a specfic user (by net_id)
//{ "person_role": 1 }
app.get('/users/net-id/:netId/person-role', (req, res) => {
  const { netId } = req.params;
  
  const query = 'SELECT person_role FROM User_info WHERE net_id = ?';
  connection.query(query, [netId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ person_role: results[0].person_role });
    }
  });
});

//Get plan for a user by net_id
//RETURN: JSON object with the plan for a specfic user (by net_id)
//{ "plan": 1 }
app.get('/users/net-id/:netId/plan', (req, res) => {
  const { netId } = req.params;
  
  const query = 'SELECT plan FROM User_info WHERE net_id = ?';
  connection.query(query, [netId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ plan: results[0].plan });
    }
  });
});

//exports for testing
module.exports = app;