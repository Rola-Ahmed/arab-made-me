import io from "socket.io-client";
// export const baseUrl = "http://localhost:5000/api/v1";

export const baseUrl =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_DEV_BASE_URL;

export const baseUrl_IMG =
  process.env.REACT_APP_NODE_ENV == "production"
    ? process.env.REACT_APP_IMAGE_URL
    : process.env.REACT_APP_DEV_IMAGE_URL;

export const socket = io.connect(baseUrl_IMG, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

// export const baseUrl = "http://13.60.166.80:5000/api/v1";
// // : process.env.REACT_APP_DEV_BASE_URL;

// export const baseUrl_IMG = "http://13.60.166.80:5000";

// export const socket = io(baseUrl_IMG, {
//   autoConnect: true, // Do not connect automatically
// });
