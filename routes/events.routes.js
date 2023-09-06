const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Event = require("../models/Event.model");
const Session = require("../models/Session.model");
const User = require("../models/User.model");

// RUTAS DE LOS EVENTOS

// GET "/api/events" => lista de todos los eventos

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const eventData = await Event.find();
    

    const response = { eventData};
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST "/api/events" => creamos un nuevo evento

router.post("/", async (req, res, next) => {
  console.log("viene del body", req.body);
  let bodyImg;
  if (req.body.imgEvent === null) {
    bodyImg =
      "https://res.cloudinary.com/dz2owkkwa/image/upload/v1693741450/forumEvents/jhunvhpsrfikrs2jdch2.jpg";
  } else {
    bodyImg = req.body.imgEvent;
  }
  const {
    eventName,
    startDate,
    endDate,
    itsFree,
    price,
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
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" });
    return;
  }

  try {
    await Event.create({
      eventName,
      startDate,
      endDate,
      itsFree,
      price,
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

router.get("/:eventId", isAuthenticated, async (req, res, next) => {
  const eventId = req.params.eventId;
  try {  
    const userData = await User.findById(req.payload._id).select({
      eventsAsistance: 1,
    });
    const responseEvent = await Event.findById(eventId);
    const responseSession = await Session.find({
      eventName: req.params.eventId,
    })
    const usersArrayInEvent = await User.find({eventsAsistance:{$in: eventId}})
    // .populate("assistants")
    .sort("day");
    // console.log("sessionArray",responseSession)
    let sessionsArray =[]
    let eventArray =[]
    // console.log("userData",userData)
  
 console.log("Ver esto",responseSession.length)
 if (responseSession.length > 0) {

 
    for (let i = 0; i< responseSession[responseSession.length-1].day; i++) {
  
      sessionsArray.push([])

    }
    for (let i = 0; i< responseSession.length; i++ ){
      console.log(responseSession[i].day - 1)
      sessionsArray[responseSession[i].day - 1].push(responseSession[i])
      
    }
  }
    console.log("sessionsArray",sessionsArray)
    res.json({ responseEvent, responseSession, sessionsArray, userData, usersArrayInEvent });
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
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" });
    return;
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

router.put("/:eventId/sessions/:sessionId", isAuthenticated, async (req, res, next) => {
  const { sessionId, eventId } = req.params;
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
    hostedBy,
    idAsistant,
    assistants
  } = req.body.editSession;
  console.log("QUIERO VER ESTO", req.body.editSession);

let newAsistant = +0
idAsistant ? newAsistant = -1 : null

  if (
    sessionName === "" ||
    description === "" ||
    day === 0 ||
    dateSession === "" ||
    startHour === "" ||
    endHour === ""
  ) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" });
    return;
  }

  try {
    // if (idAsistant && assistants.includes(idAsistant) === true) {
    //   await Session.findByIdAndUpdate(sessionId, {
    //     $pull: { assistants: idAsistant },
    //     $inc: {capacityHall: +1}
    //   })

    //   return;
    // } else {
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
      hostedBy,
      $push: { assistants: idAsistant },
      $inc: {capacityHall: newAsistant}

    });    
    res.json("Session modifed");

    return;
    


  } catch (error) {
    next(error);
  }
});


//PUT "/api/events/:eventId/sessions/:sessionId/join" => Apuntarse a una sesion 
router.put("/:eventId/sessions/:sessionId/join",isAuthenticated, async (req, res, next) => {
const {assistants, capacityHall} =  req.body
const { sessionId } = req.params;
console.log(req.params)
console.log(req.body)
console.log(req.payload)
try {
  if (assistants.includes(req.payload._id) === true) {
    await Session.findByIdAndUpdate(sessionId, {
      $pull: { assistants: req.payload._id }
   
    })
    // !assistants.includes(req.payload._id) && 
    res.json("desapuntado correctamente en la sesión")
    return;
  } else if (assistants.length < capacityHall) {
    await Session.findByIdAndUpdate(sessionId, {
      $push: { assistants: req.payload._id }
   
    })
    res.json("Inscrito correctamente en la sesión")
    return;
  } else {
    res.json({ succesMessage: "No quedan plazas disponibles para esta sesión" });
  }

} catch (error) {
  res.status(400).json({ errorMessage: "" });
  
}

})


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

// PUT "/api/events/:eventId/inscription" => Inscribirse a un evento, (modificar array eventos inscritos del user)

router.put("/:eventId/inscription", isAuthenticated, async (req, res, next) => {
  // console.log("este es el console", req.payload);
   const eventId = req.params.eventId.toString()
  const { _id, email, role } = req.payload;
  const { eventsUserArr } = req.body
  console.log("eventsUserArr = ", eventsUserArr);
 
  try {
     const eventCapacity = await Event.findById(req.params.eventId).select( {capacity: 1})
     const usersArrayInEvent = await User.find({eventsAsistance:{$in: eventId}})
     console.log("capacidad evento",eventCapacity)
     console.log("userArrayInEvent",usersArrayInEvent.length)
    if (eventsUserArr.includes(req.params.eventId) === true) {
      await User.findByIdAndUpdate(req.payload._id, {
        $pull: { eventsAsistance: req.params.eventId },
      });
      // await Session.updateMany({assistants: {$in: _id},
      //    $pull: {assistants: _id}
          
      // });
      res.json( "Te has dado de baja del evento");
      return;
    } else if ( eventsUserArr.includes(req.params.eventId) === false && usersArrayInEvent.length < eventCapacity.capacity) {
      await User.findByIdAndUpdate(req.payload._id, {
        $push: { eventsAsistance: req.params.eventId },
      });
      res.json("Te has inscrito al evento");
      return;
    } else if ( eventsUserArr.includes(req.params.eventId) === false && usersArrayInEvent.length >= eventCapacity.capacity
    ) {
      res.json("No quedan plazas para este evento");
      return;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
