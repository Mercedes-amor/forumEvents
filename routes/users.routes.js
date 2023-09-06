const router = require("express").Router();
const Event = require("../models/Event.model");
const Session = require("../models/Session.model");
const User = require("../models/User.model")

const isAuthenticated = require("../middlewares/isAuthenticated")

// GET "/api/user/:userId" => pagina personal del usuario

router.get("/userProfile", isAuthenticated, async (req, res, next)=> {
    console.log(req.payload)
try {
    const response = await User.findById(req.payload._id).
    populate("eventsAsistance")
    console.log(response)
    res.json(response)
} catch (error) {
    next(error)
}

})

// DELETE "/api/user/:userId" => eliminar usuario

router.delete("/deleteAcount", isAuthenticated, async (req, res, next)=> {
    console.log(req.payload)
try {
     await Session.updateMany({$or: [{assistants: {$in: req.payload._id}},{hostedBy: req.payload._id}] },  {$pull: {assistants: req.payload._id}, $pull: {hostedBy: req.payload._id} });     

     await User.findByIdAndDelete(req.payload._id)

    res.json("Usuario eliminado")
} catch (error) {
    next(error)
}

})












module.exports = router;
