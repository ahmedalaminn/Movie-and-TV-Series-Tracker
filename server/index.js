require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db.js");
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/auth.js");
const { User } = require('./models/user.js');

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// fetching user
app.get('/getUser', (req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.json(err));
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
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Error updating watchlist', error });
    }
});

// starting server
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));