require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db.js");
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/auth.js");
const { User } = require('./models/user.js');

// Database connection
connection();

// Middleware
app.use(express.json());
const corsOptions = {
    origin: 'https://entertainment-watchlist-frontend.vercel.app', // Adjust as per your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Fetch user
app.get('/getUser', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add to watchlist route
app.post('/addWatchlist', async (req, res) => {
    try {
        const user = await User.findOne();
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { imdbID, name, type } = req.body;
        user.watchlist.push({ imdbID, name, type });
        await user.save();

        res.status(200).json({ message: 'Watchlist updated successfully', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Error updating watchlist', error });
    }
});

// Starting server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));