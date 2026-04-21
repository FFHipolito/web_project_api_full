require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { NODE_ENV, JWT_SECRET } = process.env;

async function getUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany();
    res.send({ data: users });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      const err = new Error("Usuário não encontrado");
      err.statusCode = 404;
      throw err;
    }
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
}

async function getUserInfo(req, res, next) {
  const { user } = req;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: user._id },
    });
    if (!userData) {
      const err = new Error("Usuário não encontrado");
      err.statusCode = 404;
      throw err;
    }
    res.send({ data: userData });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).send({ message: "Dados inválidos..." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name || "Jacques Cousteau",
        about: about || "Explorer",
        avatar: avatar || "https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg",
        email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      data: {
        id: newUser.id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err.code === 'P2002') {
       return res.status(409).send({ message: "Este e-mail já está em uso" });
    }
    next(err);
  }
}

async function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name && !about) {
    return res.status(400).send({ message: "Dados inválidos..." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        about: about || undefined,
      },
    });
    res.send({ data: updatedUser });
  } catch (err) {
    next(err);
  }
}

async function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!avatar) {
    return res.status(400).send({ message: "Dados inválidos..." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
    res.send({ data: updatedUser });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).send({ message: "E-mail e senha são obrigatórios" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const err = new Error("Senha ou e-mail incorreto");
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Senha ou e-mail incorreto");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { _id: user.id },
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
      { expiresIn: "7d" }
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
