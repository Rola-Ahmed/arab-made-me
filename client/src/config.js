import io from "socket.io-client";
export const baseUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL
    : process.env.REACT_APP_DEV_BASE_URL;

export const baseUrl_IMG =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_IMAGE_URL
    : process.env.REACT_APP_DEV_IMAGE_URL;

// export const socket = io.connect(baseUrl_IMG, {
//   transports: ["websocket", "polling"],
// });

// console.log("socket", socket);
// console.log("socket", socket.connect);
// console.log("socket", socket.id);



export const socket = io(baseUrl_IMG, {
  autoConnect: false, // Do not connect automatically
});

// const io2 = new Server({
//   cors: {
//     origin: "http://localhost:3000"
//   }
// });

// io2.listen(3000);

// export const socket = io(URL);
// export const baseUrl =
// process.env.REACT_APP_DEV_BASE_URL;

// export const baseUrl_IMG = process.env.REACT_APP_IMAGE_URL;
