const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCards(req, res, next) {
  try {
    const cards = await prisma.card.findMany({
      include: {
        owner: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const userId = req.user._id;

  if (!name || !link) {
    return res.status(400).send({ message: "Dados inválidos..." });
  }

  try {
    const card = await prisma.card.create({
      data: {
        name,
        link,
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });
    res.send({ data: card });
  } catch (err) {
    next(err);
  }
}

async function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return res.status(404).send({ message: "Card não encontrado" });
    }

    if (card.ownerId !== userId) {
      return res.status(403).send({ message: "Você não tem permissão para deletar este card" });
    }

    await prisma.card.delete({
      where: { id: cardId },
    });

    res.send({ message: "Card deletado com sucesso" });
  } catch (err) {
    next(err);
  }
}

async function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        likes: {
          connect: { id: userId },
        },
      },
      include: {
        likes: true,
      }
    });
    res.send({ data: card, message: "Like com sucesso" });
  } catch (err) {
    if (err.code === 'P2025') {
        return res.status(404).send({ message: "Card não encontrado" });
    }
    next(err);
  }
}

async function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        likes: {
          disconnect: { id: userId },
        },
      },
      include: {
        likes: true,
      }
    });
    res.send({ data: card, message: "Dislike com sucesso" });
  } catch (err) {
    if (err.code === 'P2025') {
        return res.status(404).send({ message: "Card não encontrado" });
    }
    next(err);
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
