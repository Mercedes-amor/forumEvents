const router = require("express").Router();
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")

const jwt = require("jsonwebtoken")
const isAuthenticated = require("../middlewares/isAuthenticated")


// POST "/api/auth/signup" => registrar al usuario

router.post("/signup", async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body

    //validaciones
    if (!username || !email || !password) {
        res.status(400).json({ errorMessage: "Todos los campos deben estar llenos" })
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({ errorMessage: "Las contraseñas no coinciden" })
        return;
    }


    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (regexPassword.test(password) === false) {
      res.status(400).json({ errorMessage:

       "La contraseña debe tener al menos, una mayuscula, una minuscula, un caracter especial y tener 8 caracteres o más",
      });
      return;
    }
    try {

        const foundEmail = await User.findOne({ email })

        if (foundEmail !== null) {
            res.status(400).json({ errorMessage: "Email ya registrado" })
            return;
        }

        //Encriptación cotraseña
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)


        //Creación usuario en BD
        await User.create({
            username,
            email,
            password: hashPassword,
            eventsAsistance:[]
        })
        res.json("Usuario creado")
    } catch (error) {
        next(error)
    }
})



// POST "/api/auth/login" => logear al usuario

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body
    console.log("req.body",req.body)


    try {
        // - Que el usuario exista
        const foundUser = await User.findOne({email})
        console.log("foundUser",foundUser)
        if (foundUser === null) {
            res.status(400).json({ errorMessage: "Usuario no registrado" })
            return;
        }

        // - Que la contraseña sea correcta

        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        if (isPasswordValid === false) {
            res.status(400).json({ errorMessage: "Contraseña no correcta" })
            return;
        }

        // res.json("Usuario logeado")
        //Tokens

        //En el payload agregamos información que no debería cambiar del usuario

        const payload = {
            _id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role,
        }
        console.log("payload justo al crear", payload)

        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: "HS256", expiresIn: "5d"}
       )

        res.json({authToken})
    } catch (error) {
        next(error)
    }

})

// GET "/api/auth/verify" => indicar al Front que el usuario está activo

router.get("/verify", isAuthenticated, (req, res, next) => {

    // ¡¡¡ De ahora en adelante, cada vez que usemos el middleware isAuthenticated
    //vamos a tener acceso a algo llamado req.payload !!!
    console.log("req.payload",req.payload)

    res.json(req.payload)
})


module.exports = router;
