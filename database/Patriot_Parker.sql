CREATE DATABASE IF NOT EXISTS Patriot_Parker;
USE Patriot_Parker;

DROP TABLE Parking_Location;
DROP TABLE User_info;

CREATE TABLE Parking_Location (
lot_id INT PRIMARY KEY NOT NULL,
deck_or_lot_name VARCHAR(255), 
spots_available INT,
total_spots INT,
is_it_deck INT,
is_full BOOLEAN
);



CREATE TABLE User_info (
id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
net_id INT,
license_plate VARCHAR(255),
checkin_time INT,
    person_role INT,
    plan INT
);

INSERT INTO Parking_Location (lot_id, deck_or_lot_name, spots_available, total_spots, is_it_deck, is_full)
 VALUES

(1,'Lot A', 500, 2500, 1, false),
(2,'Lot K', 250, 2750, 1, false),
(3,'Lot M', 0, 3000, 1, true),
(4,'rappahannock deck', 500, 2500, 2, false),
(5,'rappahannock deck', 500, 2500, 2, false),
(6,'rappahannock deck', 500, 2500, 2, true),
(7,'Shenandoah deck', 1000, 4000, 2, false),
(8,'Shenandoah deck', 500, 4500, 2, false),
(9,'Shenandoah deck', 0, 5000, 2, true);

INSERT INTO User_info (net_id, license_plate, person_role, plan)
VALUES
(12345,'UUL9900', '1',1),
(13579, 'XYZ000', '2', 3);


SELECT *
FROM Parking_Location, User_info;
