import { Router } from "express";

import { dataController } from "../controllers/dashboard.controller.js";
import auth from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();
dashboardRouter.get("/", auth, dataController);

export default dashboardRouter;
