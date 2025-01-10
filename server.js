const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bookingsRoutes = require('./routes/bookings');

// Initialize the app
const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/bookings', bookingsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
