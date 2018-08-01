const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
  console.log(`this app is running on ${PORT}`);
});
