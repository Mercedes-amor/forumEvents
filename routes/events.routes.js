const router = require("express").Router();
const Event = require("../models/Event.model");
const Session = require("../models/Session.model");


// RUTAS DE LOS EVENTOS

// GET "/api/events" => lista de todos los eventos.

router.get("/", async (req, res, next) => {
  try {
    const response = await Event.find().select({
      eventName: 1,
      sector: 1,
      imgEvent: 1,
    });
    console.log(response);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/events" => creamos un nuevo evento

router.post("/", async (req, res, next) => {
  const {
    eventName,
    startDate,
    endDate,
    itsFree,
    capacity,
    sector,
    imgEvent,
    description,
  } = req.body;


  if (!eventName || !startDate || !endDate || !itsFree || !capacity || !sector || !description) {
    res.json("todos los campos deben estar completos")
  }

  try {
    await Event.create({
      eventName,
      startDate,
      endDate,
      itsFree,
      capacity,
      sector,
      imgEvent,
      description,
    });

    res.json("Evento creado");
  } catch (error) {
    next(error);
  }
});

// GET "/api/events/:eventId" => Detalles de un evento

router.get("/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  try {
    const response = await Event.findById(eventId);
    console.log(response);
    res.json(response);
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
  } = req.body;

  if (!eventName || !startDate || !endDate || !itsFree || !capacity || !sector || !description) {
    res.json("todos los campos deben estar completos")
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
    await Event.findByIdAndDelete(eventId)
    await Session.deleteMany({
      eventName: eventId
    })

    res.json("Este evento fue eliminado.")
  } catch (error) {
    next(error)
  }
})


// RUTAS DE LAS SESIONES

// GET "/api/events/:eventId/sessions" => lista todos las sesiones de un evento
router.get("/:eventId/sessions", async (req, res, next) => {

  try {
    const response = await Session.find({ eventName: req.params.eventId })
      .populate("eventName")
    res.json(response)
    console.log("params", req.params.eventId)

  } catch (error) {
    next(error)
  }
})


// POST "/api/events/:eventId/sessions" => añadir sesiones a un evento
router.post("/:eventId/sessions", async (req, res, next) => {

  const { sessionName, description, day, dateSession, startHour, endTHour, isAvailable, hall, capacityHall } = req.body
  
  if (!sessionName || !description || !day || !dateSession || !startHour || !endTHour || !isAvailable) {
    res.json("todos los campos deben estar completos")
  }

  try {
    const response = await Session.create({
      sessionName,
      eventName: req.params.eventId,
      description,
      day,
      dateSession,
      startHour,
      endTHour,
      isAvailable,
      hall,
      capacityHall

    })

    res.json(response)
    console.log("params", req.params.eventId)

  } catch (error) {
    next(error)
  }


})

// PUT "/api/events/:eventId/sessions/:sessionId" => Editar detalles de una sesión

router.put("/:eventId/sessions/:sessionId", async (req, res, next) => {
  const {sessionId, eventId}  = req.params
 
  const {
    sessionName,
    eventName,
    description,
    day,
    dateSession,
    startHour,
    endTHour,
    isAvailable,
    hall,
    capacityHall
  } = req.body;

  if (!sessionName || !description || !day || !dateSession || !startHour || !endTHour || !isAvailable) {
    res.json("todos los campos deben estar completos")
  }


  try {
    await Session.findByIdAndUpdate(sessionId, {
      sessionName,
      eventName: eventId,
      description,
      day,
      dateSession,
      startHour,
      endTHour,
      isAvailable,
      hall,
      capacityHall
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
    await Session.findByIdAndDelete(sessionId)

  res.json("Esta sesión fue eliminada.")
  } catch (error) {
    next(error)
  }
})









module.exports = router;
