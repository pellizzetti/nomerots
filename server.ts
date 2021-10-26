import server from "./app";

const FIFTEEN_SECONDS = 15 * 1000;

server
  .listen(4000, () => {
    console.info(`server is running!`);
  })
  .on("error", (err) => {
    console.error(err);
  });
