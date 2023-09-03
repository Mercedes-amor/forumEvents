const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Event = require("../models/Event.model");
const Session = require("../models/Session.model");
const User = require("../models/User.model")

// RUTAS DE LOS EVENTOS

// GET "/api/events" => lista de todos los eventos

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const eventData = await Event.find();
    const userData = await User.findById(req.payload._id).select({ eventsAsistance: 1 })

    const response = { eventData, userData }
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/events" => creamos un nuevo evento

router.post("/", async (req, res, next) => {
  console.log("viene del body", req.body);
  let bodyImg;
  if (req.body.imgEvent === "") {
    bodyImg = "https://ipmark.com/wp-content/uploads/eventos-5-800x445.jpg";
  } else {
    bodyImg = req.body.imgEvent;
  }
  const {
    eventName,
    startDate,
    endDate,
    itsFree,
    capacity,
    sector,
    description,
  } = req.body;

  if (
    !eventName ||
    !startDate ||
    !endDate ||
    !itsFree ||
    !capacity ||
    !sector ||
    !description
  ) {
    res.json("todos los campos deben estar completos");
  }

  try {
    await Event.create({
      eventName,
      startDate,
      endDate,
      itsFree,
      capacity,
      sector,
      imgEvent: bodyImg,
      description,
    });

    res.json("Evento creado");
  } catch (error) {
    next(error);
  }
});

// GET "/api/events/:eventId" => Detalles de un evento  y sus sesiones.

router.get("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  try {
    const responseEvent = await Event.findById(eventId);
    const responseSession = await Session.find({
      eventName: req.params.eventId,
    });

    res.json({ responseEvent, responseSession });
  } catch (error) {
    next(error);
  }
});

// PUT "/api/events/:eventId" => Editar detalles de un evento

router.put("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  const {
    eventName,
    startDate,
    endDate,
    itsFree,
    capacity,
    sector,
    imgEvent,
    description,
  } = req.body.editEvent;

  if (
    !eventName ||
    !startDate ||
    !endDate ||
    !itsFree ||
    !capacity ||
    !sector ||
    !description
  ) {
    res.json("todos los campos deben estar completos");
  }

  try {
    await Event.findByIdAndUpdate(eventId, {
      eventName,
      startDate,
      endDate,
      itsFree,
      capacity,
      sector,
      imgEvent,
      description,
    });

    res.json("Evento modificado");
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/events/:eventId" => esta ruta elimina un evento

router.delete("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  try {
    await Event.findByIdAndDelete(eventId);
    await Session.deleteMany({
      eventName: eventId,
    });

    res.json("Este evento fue eliminado.");
  } catch (error) {
    next(error);
  }
});

// RUTAS DE LAS SESIONES

// GET "/api/events/:eventId/sessions" => lista todos las sesiones de un evento
// router.get("/:eventId/sessions", async (req, res, next) => {

//   try {
//     const response = await Session.find({ eventName: req.params.eventId })
//       .populate("eventName")
//     res.json(response)
//     console.log("params", req.params.eventId)

//   } catch (error) {
//     next(error)
//   }
// })

// POST "/api/events/:eventId/sessions" => añadir sesiones a un evento
router.post("/:eventId/sessions", async (req, res, next) => {
  const {
    sessionName,
    description,
    day,
    dateSession,
    startHour,
    endHour,
    isAvailable,
    hall,
    capacityHall,
  } = req.body.newSession;

  if (
    !sessionName ||
    !description ||
    !day ||
    !dateSession ||
    !startHour ||
    !endHour ||
    !isAvailable
  ) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" })
    return;;
  }

  try {
    await Session.create({
      sessionName,
      eventName: req.params.eventId,
      description,
      day,
      dateSession,
      startHour,
      endHour,
      isAvailable,
      hall,
      capacityHall,
    });

    res.json({ successFullMessage: "La sesión fue creada con exito" });
    // console.log("params", req.params.eventId);
  } catch (error) {
    next(error);
  }
});

// PUT "/api/events/:eventId/sessions/:sessionId" => Editar detalles de una sesión

router.put("/:eventId/sessions/:sessionId", async (req, res, next) => {
  const { sessionId, eventId } = req.params
  const {
    sessionName,
    description,
    day,
    dateSession,
    startHour,
    endHour,
    isAvailable,
    hall,
    capacityHall,

  } = req.body.editSession;

  if (
    !sessionName ||
    !description ||
    !day ||
    !dateSession ||
    !startHour ||
    !endHour ||
    !isAvailable
  ) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" })
    return;;
  }

  try {
    await Session.findByIdAndUpdate(sessionId, {
      sessionName,
      eventName: eventId,
      description,
      day,
      dateSession,
      startHour,
      endHour,
      isAvailable,
      hall,
      capacityHall,
    });

    res.json("Session modifed");
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/events/:eventId/sessions/:sessionId" => Eliminar una session

router.delete("/:eventId/sessions/:sessionId", async (req, res, next) => {
  const sessionId = req.params.sessionId;
  try {
    await Session.findByIdAndDelete(sessionId);

    res.json("Esta sesión fue eliminada.");
  } catch (error) {
    next(error);
  }
});

//RUTAS USUARIOS INCRITOS

// PUT "/api/events/:eventId/inscription" => lista de todos los eventos

router.put("/:eventId/inscription", isAuthenticated, async (req, res, next) => {
  console.log("este es el console", req.payload)
  const { _id, email, role } = req.payload
  const { eventCapacity, eventsUserArr } = req.body
  console.log("eventsUserArr", eventsUserArr)
  try {

    if (eventsUserArr.includes(req.params.eventId) === true) {

      await User.findByIdAndUpdate(req.payload._id, {

        $pull: { eventsAsistance: req.params.eventId },

      })
      await Event.findByIdAndUpdate(req.params.eventId, {
        $inc: { capacity: +1 }
      })
      res.json("Te has dado de baja del evento")
      return;
    } else if (eventsUserArr.includes(req.params.eventId) === false && req.body.eventCapacity > 0) {
      await User.findByIdAndUpdate(req.payload._id, {

        $push: { eventsAsistance: req.params.eventId },

      })
      // .populate("eventsAsistance")
      await Event.findByIdAndUpdate(req.params.eventId, {
        $inc: { capacity: -1 }
      })
      res.json("Te has inscrito al evento")
      return;
    } else if (eventsUserArr.includes(req.params.eventId) === false && req.body.eventCapacity < 1) {
      res.status(400).json({ errorMessage: "No quedan plazas disponibles" });
      res.json("No quedan plazas para este evento")
      return;
    }


  } catch (error) {
    next(error)
  }






})


module.exports = router;
