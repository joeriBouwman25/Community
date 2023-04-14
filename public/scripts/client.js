const socket = io();

socket.on("start", (data) => {
  console.log(data);
});
