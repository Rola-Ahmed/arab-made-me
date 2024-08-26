import io from "socket.io-client";

export const baseUrl =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_DEV_BASE_URL;

export const baseUrl_IMG =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_IMAGE_URL
    : process.env.REACT_APP_DEV_IMAGE_URL;

// export const baseUrl = "http://localhost:5000/api/v1";
// "https://backend-rail-subbase-production.up.railway.app/api/v1";

// export const baseUrl_IMG = "http://localhost:5000";

export const map_api_Key = "gqEosgdSKdu6kLxXYi6ubsnOdssVsZL4EV8K60I7Xr4";

// "https://backend-rail-subbase-production.up.railway.app";

export const socket = io.connect(baseUrl_IMG, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  cors: {
    origin: "*",
  },
});

//
// io.listen(4000);
