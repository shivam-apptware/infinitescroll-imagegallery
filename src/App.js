import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, Button, Space } from "antd";
import LazyLoad from "react-lazyload";

const clientID = `?client_id=${process.env.REACT_APP_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        (!loading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Images"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <Button type="primary" onClick={handleSubmit} className="search-button">
          Search
        </Button>
      </div>
      <div className="card-container">
        {photos.map((image, index) => (
          <LazyLoad key={index} height={200} offset={100}>
            <Card className="card">
              <img src={image.urls.regular} alt="Image" />
              <div className="card-content">
                <h3 className="card-title">{image.alt_description}</h3>
                <p className="card-description">{image.description}</p>
              </div>
            </Card>
          </LazyLoad>
        ))}
        {loading && <div className="loading-message">Please wait...</div>}
      </div>
    </div>
  );
}

export default App;
