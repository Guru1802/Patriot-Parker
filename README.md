Patriot Parker - README
Overview
Patriot Parker is a mobile-friendly web application designed for the George Mason University community. It allows users to locate available parking spots across various parking lots and decks in real time. This app streamlines parking management by offering both students and staff an efficient way to navigate the often congested campus parking, reducing time spent searching for spots.

The system relies on user input to maintain accurate parking availability, where users can check in when they park and update the system when they leave. The app integrates a backend database for spot tracking and user authentication, along with a responsive frontend that ensures an intuitive user experience.

Features
Real-Time Parking Availability: View the current number of available spots in selected lots and decks.
User Check-In/Check-Out System: Users contribute to the accuracy of parking data by updating the system when they park and leave.
Search Functionality: Filter parking availability based on specific lots or decks.
User Authentication: Secure login and registration system to personalize the user experience and track parking habits.
Mobile-Responsive Design: Optimized for seamless use on mobile devices, ensuring accessibility on the go.
Project Structure
Backend
Database: The backend handles user authentication and tracks parking availability using tables for users and lots. A SQL-based database is used to store parking spot data and user records.
API Endpoints: RESTful API architecture is employed for handling parking spot updates, user check-ins, and database queries.
Tech Stack:
Node.js for the backend logic.
Express.js as the server framework.
PostgreSQL (or equivalent SQL-based database) for persistent data storage.
Frontend
User Interface: Built using HTML, CSS, and JavaScript, providing a mobile-first, responsive design. Users can search for parking availability, log in, and update their status via a clean and intuitive UI.
Search and Filter Options: The frontend allows users to filter parking lot data and view relevant information in real-time.
Tech Stack:
React.js for the component-based UI.
Bootstrap or CSS Grid/Flexbox for responsive design.
