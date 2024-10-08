const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require("../utils/validate");

const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard
);

router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardById
);

router.put(
  "/likes/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard
);

router.delete(
  "/likes/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
