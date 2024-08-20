require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errors, celebrate, Joi } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { login, createUser } = require("./controllers/users");
const { validateURL } = require("./utils/validate");
const auth = require("./middlewares/auth");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

const allowedCors = [
  "https://myaround.mooo.com",
  "http://myaround.mooo.com",
  "localhost:3000",
];

app.use(function (req, res, next) {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    if (allowedCors.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Origin", "*");
      const { method } = req;

      const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

      if (method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
      }
      const requestHeaders = req.headers["access-control-request-headers"];
      if (method === "OPTIONS") {
        res.header("Access-Control-Allow-Headers", requestHeaders);
        return res.end();
      }
    }
  }

  next();
});

app.use(requestLogger);

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("O servidor travará agora");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().optional().min(2).max(30),
      about: Joi.string().optional().min(2).max(30),
      avatar: Joi.string().optional().custom(validateURL),
    }),
  }),
  createUser
);

app.use(
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  auth
);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "A solicitação não foi encontrada" });
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "Ocorreu um erro no servidor" : message,
  });
});

mongoose
  .connect("mongodb://localhost:27017/aroundb")
  .then(() => {
    console.log(`MongoDB connected...`);

    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
