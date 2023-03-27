import { Router } from "express";

const router = Router();

router.post("/api/users/signout", (req, res) => {

    //limpiar la sesion

    req.session = null;
    res.send({});
})

export { router as signoutRouter }