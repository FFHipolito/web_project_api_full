const express = require("express");
const mongoose = require("mongoose");
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "6690204fad62f62344a91dfb",
  };
  next();
});

app.use(express.json());

app.use("/cards", cardsRouter);
app.use("/users", usersRouter);

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => {
    console.log("MongoDB connected...");

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res) => {
  res.status(404).json({ message: "A solicitação não foi encontrada" });
});
