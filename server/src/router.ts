import { Router } from "express";
import getSavings from "./controllers/getSavings";

const router = Router();

router.get("/savings", getSavings);

export default router;
