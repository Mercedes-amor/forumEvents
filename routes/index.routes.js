const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const eventsRouter = require("./events.routes");
router.use("/events", eventsRouter);

const usersRouter = require("./users.routes");
router.use("/users", usersRouter);

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

const paymentRoutes = require("./payment.routes");
router.use("/payment", paymentRoutes);

module.exports = router;
