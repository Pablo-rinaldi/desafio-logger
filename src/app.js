const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const { port } = require("./config/config.js");
const addLogger = require("./utils/logger.js");

require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockingProductsRouter = require("./routes/mockingProducts.router.js");
const loggerRouter = require("./routes/logger.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(addLogger);

//Passport
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//AuthMiddleware
const authMiddleware = require("./middleware/authMiddleware.js");
app.use(authMiddleware);

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", mockingProductsRouter);
app.use("/", viewsRouter);
app.use("/loggertest", loggerRouter);

const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const SocketManager = require("./sockets/socketmanager.js");

new SocketManager(httpServer);
