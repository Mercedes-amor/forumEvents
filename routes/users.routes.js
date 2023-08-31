const router = require("express").Router();
const Event = require("../models/Event.model");
const Session = require("../models/Session.model");
const User = require("../models/User.model")

const isAuthenticated = require("../middlewares/isAuthenticated")

// GET "/api/user/:userId" => pagina personal del usuario

router.get("/:userId", isAuthenticated, async (req, res, next)=> {
    console.log(req.payload)
try {
    const response = await User.findById(req.payload._id)
    console.log(response)
    res.json(response)
} catch (error) {
    next(error)
}

})

// DELETE "/api/user/:userId" => eliminar usuario

router.delete("/:userId", isAuthenticated, async (req, res, next)=> {
    console.log(req.payload)
try {
     await User.findByIdAndDelete(req.payload._id)

    res.json("Usuario eliminado")
} catch (error) {
    next(error)
}

})












module.exports = router;
