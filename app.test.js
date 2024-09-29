const request = require('supertest');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const app = require('./app');

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', 'database', 'Patriot_Parker.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

// Create a MySQL connection
let connection;
beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true,
  });

  // Create the database and execute the SQL script
  await connection.query(`CREATE DATABASE IF NOT EXISTS Patriot_Parker`);
  await connection.query(`USE Patriot_Parker`);
  await connection.query(sqlScript);
});

afterAll(async () => {
  // Close the database connection
  await connection.end();
});

//=====================================================================//
//                              TESTS                                  //
//=====================================================================//
//                             PARKING                                 //
//=====================================================================//
describe('Parking Location API', () => {
  test('GET /parking-locations should return all parking locations', async () => {
    const response = await request(app).get('/parking-locations');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('GET /parking-locations/:id should return a specific parking location', async () => {
    const response = await request(app).get('/parking-locations/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('lot_id', 1);
  });

  test('GET /parking-locations/:id/spots-available should return the number of available spots for a specific parking location', async () => {
    const response = await request(app).get('/parking-locations/1/spots-available');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('spots_available');
  });

  test('GET /parking-locations/:id/total-spots should return the total number of spots for a specific parking location', async () => {
    const response = await request(app).get('/parking-locations/1/total-spots');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('total_spots');
  });

  test('GET /parking-locations/:id/is-deck should indicate if a specific parking location is a deck', async () => {
    const response = await request(app).get('/parking-locations/1/is-deck');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('is_deck');
  });

  test('GET /parking-locations/:id/is-full should indicate if a specific parking location is full', async () => {
    const response = await request(app).get('/parking-locations/1/is-full');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('is_full');
  });

  test('PUT /parking-locations/:id/increment-spots should increment the available spots for a specific parking location', async () => {
    const response = await request(app).put('/parking-locations/1/increment-spots');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Spots available incremented successfully');
  });

  test('PUT /parking-locations/:id/decrement-spots should decrement the available spots for a specific parking location', async () => {
    const response = await request(app).put('/parking-locations/1/decrement-spots');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Spots available decremented successfully');
  });

  test('PUT /parking-locations/:id/increment-spots should return an error if the parking location is not found', async () => {
    const response = await request(app).put('/parking-locations/999/increment-spots');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Parking location not found');
  });

  test('PUT /parking-locations/:id/decrement-spots should return an error if the parking location is not found', async () => {
    const response = await request(app).put('/parking-locations/999/decrement-spots');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Parking location not found or no available spots');
  });

  test('PUT /parking-locations/:id/decrement-spots should return an error if there are no available spots', async () => {
    // First, set the spots_available to 0 for a specific parking location
    await connection.query('UPDATE Parking_Location SET spots_available = 0 WHERE lot_id = 1');

    const response = await request(app).put('/parking-locations/1/decrement-spots');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Parking location not found or no available spots');

    // Reset the spots_available to a non-zero value after the test
    await connection.query('UPDATE Parking_Location SET spots_available = 500 WHERE lot_id = 1');
  });

});

//=====================================================================//
//                               USERS                                 //
//=====================================================================//
describe('User API', () => {
  test('GET /users should return all users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('GET /users/:id should return a specific user', async () => {
    const response = await request(app).get('/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('GET /users/net-id/:netId/license-plate should return the license plate for a specific user by net ID', async () => {
    const response = await request(app).get('/users/net-id/12345/license-plate');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('license_plate');
  });

  test('GET /users/net-id/:netId/checkin-time should return the check-in time for a specific user by net ID', async () => {
    const response = await request(app).get('/users/net-id/12345/checkin-time');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('checkin_time');
  });

  test('GET /users/net-id/:netId/person-role should return the person role for a specific user by net ID', async () => {
    const response = await request(app).get('/users/net-id/12345/person-role');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('person_role');
  });

  test('GET /users/net-id/:netId/plan should return the plan for a specific user by net ID', async () => {
    const response = await request(app).get('/users/net-id/12345/plan');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('plan');
  });

  test('GET /users/:id should return an error if the user is not found', async () => {
    const response = await request(app).get('/users/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('GET /users/net-id/:netId/license-plate should return an error if the user is not found', async () => {
    const response = await request(app).get('/users/net-id/999/license-plate');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('GET /users/net-id/:netId/checkin-time should return an error if the user is not found', async () => {
    const response = await request(app).get('/users/net-id/999/checkin-time');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('GET /users/net-id/:netId/person-role should return an error if the user is not found', async () => {
    const response = await request(app).get('/users/net-id/999/person-role');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  test('GET /users/net-id/:netId/plan should return an error if the user is not found', async () => {
    const response = await request(app).get('/users/net-id/999/plan');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

});