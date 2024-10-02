import React, { useState, useEffect } from 'react';
import axios from "axios";
import styles from "./styles.module.css";
const OMDBAPIKEY = process.env.REACT_APP_OMDBAPIKEY;

const Main = () => {
    const [user, setUser] = useState(null); 
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/getUser')
            .then(response => {
                const userData = response.data[0]; 
                setUser(userData);
            })
            .catch(err => console.log(err));
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchMovies();
    };

    const fetchMovies = async () => {
        const URL = `https://www.omdbapi.com?s=${searchTerm}&apikey=${OMDBAPIKEY}`;
        const response = await fetch(URL);
        const responsejson = await response.json();
        setData(responsejson.Search || []);
    };

    const handleAddToWatchlist = async (item) => {
        try {
            const { imdbID, Title, Type } = item; 
            const payload = { 
                imdbID, 
                name: Title,
                type: Type 
            };
    
            const url = "http://localhost:8080/addWatchlist"; 
            await axios.post(url, payload);
            alert('Movie added to watchlist!');
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            alert('Failed to add movie to watchlist');
        }
    };    
    
    return (
        <div>
            <nav className={styles.navbar}>
                <h1>Movie and TV Series Tracker</h1>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        
            <div className={styles.main_container}>
                <div className={styles.sectionTitle}>Movies</div>
                <div className={styles.horizontalScroll}>
                    {user && user.watchlist && user.watchlist.length > 0 ? (
                        user.watchlist
                            .filter(item => item.type === 'movie') 
                            .map((item, index) => (
                                <div key={index} className={styles.resultItem}>
                                    <p className={styles.bold}>{item.name}</p>
                                    <img src={`https://img.omdbapi.com/?i=${item.imdbID}&apikey=${OMDBAPIKEY}`} alt={item.name} className={styles.poster} />
                                </div>
                            ))
                    ) : (
                        <p>No movies in watchlist</p>
                    )}
                </div>

                <div className={styles.sectionTitle}>Series</div>
                <div className={styles.horizontalScroll}>
                    {user && user.watchlist && user.watchlist.length > 0 ? (
                        user.watchlist
                            .filter(item => item.type === 'series')
                            .map((item, index) => (
                                <div key={index} className={styles.resultItem}>
                                    <p className={styles.bold}>{item.name}</p>
                                    <img src={`https://img.omdbapi.com/?i=${item.imdbID}&apikey=${OMDBAPIKEY}`} alt={item.name} className={styles.poster} />
                                </div>
                            ))
                    ) : (
                        <p>No series in watchlist</p>
                    )}
                </div>
    
                <div className={styles.sectionTitle}>Browse</div>
                <form onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        placeholder="Search here!" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                        className={styles.searchInput} 
                    />
                    <button type="submit" className={styles.searchButton}>Search</button>
                </form>
                
                <div className={styles.searchResults}>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div key={index} className={styles.resultItem}>
                                <p className={styles.bold}>{item.Title}</p>
                                <button 
                                    className={styles.addButton}
                                    onClick={() => handleAddToWatchlist(item)}
                                >
                                    +
                                </button>
                                <img 
                                    src={item.Poster} 
                                    alt={item.Title} 
                                    className={styles.poster} 
                                />
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;
