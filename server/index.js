require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./db.js");
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/auth.js");
const { User } = require('./models/user.js');

// Database connection
connection();

// Custom CORS middleware
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Express middleware
app.use(express.json());

// Apply CORS to the routes
app.use("/api/users", allowCors(userRoutes));
app.use("/api/auth", allowCors(authRoutes));

// Fetching user
app.get('/getUser', allowCors(async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}));

app.get('/', allowCors((req, res) => {
    res.send('API is running...'); // Confirming Vercel connection...
}));

// Add to watchlist route
app.post('/addWatchlist', allowCors(async (req, res) => {
    try {
        const user = await User.findOne(); 
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { imdbID, name, type } = req.body;
        
        user.watchlist.push({ imdbID, name, type });
        await user.save();

        res.status(200).json({ message: 'Watchlist updated successfully', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Error updating watchlist', error });
    }
}));

// Starting server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
