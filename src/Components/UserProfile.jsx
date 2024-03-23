import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UserProfile.css';
import axios from 'axios';

function UserProfile({ users, posts }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [clockInterval, setClockInterval] = useState(null);
  const [pausedTime, setPausedTime] = useState(null); 
  const [initialTimeFetched, setInitialTimeFetched] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', body: '' }); 

  useEffect(() => {
    const currentUser = users.find(user => user.id === parseInt(userId));
    setUser(currentUser);
  }, [users, userId]);

  useEffect(() => {
    axios.get('http://worldtimeapi.org/api/timezone')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry && !initialTimeFetched) {
      fetchCurrentTime(selectedCountry);
      setInitialTimeFetched(true);
    }
  }, [selectedCountry, initialTimeFetched]);

  useEffect(() => {
    let interval;
  
    if (!pausedTime) { 
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const timeParts = prevTime.split(':');
          let seconds = parseInt(timeParts[2]);
          let minutes = parseInt(timeParts[1]);
          let hours = parseInt(timeParts[0]);
          seconds += 1;
          if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
            if (minutes >= 60) {
              minutes = 0;
              hours += 1;
            }
          }
          let newTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
          return newTime;
        });
      }, 1000);
      setClockInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [pausedTime]);

  const fetchCurrentTime = (country) => {
    axios.get(`http://worldtimeapi.org/api/timezone/${country}`)
      .then(response => {
        const datetime = response.data.datetime;
        const time = datetime.split('T')[1].split('.')[0];
        setCurrentTime(time);
      })
      .catch(error => {
        console.error('Error fetching current time:', error);
      });
  };

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setInitialTimeFetched(false); 
  };

  const handlePauseStart = () => {
    if (pausedTime) {
      setPausedTime(null); 
    } else {
      setPausedTime(currentTime); 
      clearInterval(clockInterval); 
    }
  };

  const handlePostClick = (title, body) => {
    setPopupContent({ title, body });
  };

  const handleClosePopup = () => {
    setPopupContent({ title: '', body: '' });
  };

  return (
    <>
      {user && (
        <>
          <div className="header">
            <Link id="back-btn" to="/">Back</Link>
            <div className="header-content">
              <span>Country Dropdown--
                <select style={{ height: '30px', borderRadius: '8px' }} value={selectedCountry} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select> <nbsp>|  </nbsp><span id="back-btn" style={{ cursor: 'pointer' }} onClick={handlePauseStart} disabled={!selectedCountry}>{pausedTime ? 'Start' : 'Pause'}</span>
                <nbsp>  |  </nbsp>
                {selectedCountry && (pausedTime ? pausedTime : currentTime)}
              </span>
            </div>
          </div>

          <div className="profile-card">
            <div className="left-content">
              <h1><strong>Name:</strong> {user.name}</h1>
              <h3>Username: {user.username} | Catch phrase: {user.company.catchPhrase}</h3>

            </div>
            <div className="right-content">
              <p><strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.zipcode}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
          </div>

          <div className="main-container">
            {posts.filter(post => post.userId === parseInt(userId)).map((post, index) => (
              <div className="post-card" key={index} onClick={() => handlePostClick(post.title, post.body)}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </div>
            ))}
          </div>

          {popupContent.title && (
            <div className="popup-container" onClick={handleClosePopup}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>{popupContent.title}</h2>
                <p>{popupContent.body}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default UserProfile;
