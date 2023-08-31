const router = require("express").Router();
const Event = require("../models/Events.model");

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


  if ( !eventName || !startDate || !endDate || !itsFree || !capacity || !sector || !description ) {
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

  if ( !eventName || !startDate || !endDate || !itsFree || !capacity || !sector || !description ) {
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
        res.json("Este evento fue eliminado.")
    } catch (error) {
        next(error)
    }
})


module.exports = router;
