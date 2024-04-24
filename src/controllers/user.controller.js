const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const {
  jwt_secret,
  cookie_token,
  admin_email,
  admin_password,
} = require("../config/config.js");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        req.logger.debug("El usuario ya existe");
        return res.status(400).send("El usuario ya existe");
      }

      const newCart = new CartModel();
      await newCart.save();

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });

      if (email === admin_email && password === admin_password) {
        newUser.role = "admin";
      }

      await newUser.save();

      const token = jwt.sign({ user: newUser }, jwt_secret, {
        expiresIn: "1h",
      });

      res.cookie(cookie_token, token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error("No se pudo crear el usuario");
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        req.logger.debug("Usuario no valido");
        return res.status(401).send("Usuario no válido");
      }

      const isValid = isValidPassword(password, foundUser);
      if (!isValid) {
        req.logger.debug("Contraseña incorrecta");
        return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign({ user: foundUser }, jwt_secret, {
        expiresIn: "1h",
      });

      res.cookie(cookie_token, token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error("No se pudo logear, error del server");
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role,
      req.user.cart._id.toString()
    );

    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
  }

  async logout(req, res) {
    res.clearCookie(cookie_token);
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      req.logger.debug("Acceso denegado");
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
}

module.exports = UserController;
