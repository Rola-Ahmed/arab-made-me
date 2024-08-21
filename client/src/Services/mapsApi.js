import { useState, useEffect } from "react";
import axios from "axios";
import { map_api_Key } from "config.js"; // Ensure this path is correct

const useMapsApi = (query, countryCode) => {
  const [data, setData] = useState(null);
  const [apiLoadingData, setApiLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setApiLoadingData(true); // Set loading to true when starting to fetch data
      try {
        const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&apiKey=${map_api_Key}&in=countryCode:${countryCode}`;

        const response = await axios.get(url);
        console.log("response", response.data); // Log the data from response

        setData(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setApiLoadingData(false); // Set loading to false when fetch is complete
      }
    };

    fetchData();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // You can also use latitude and longitude to get more details from a reverse geocoding service
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true, // Use high accuracy if available
          timeout: 5000, // Timeout in milliseconds
          maximumAge: 0, // Cache age (0 means no cache)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  getCurrentLocation();


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position) {
   

    console.log(
      ",Latitude",
      position.coords.latitude,
      position.coords.longitude
    );
  }
  getLocation();

  return { data, apiLoadingData };
};

export default useMapsApi;
