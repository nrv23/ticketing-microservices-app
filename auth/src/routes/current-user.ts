import { Router } from "express";
import { currentUser } from "./middleware/current-user";


const router = Router();

router.get("/api/users/currentuser", currentUser,(req, res) => {

    res.send({currentUser: !req.currentUser? null: req.currentUser});
});

export { router as currentUserRouter }