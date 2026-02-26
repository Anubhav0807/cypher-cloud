import { Router } from "express";

import { uploadController } from "../controllers/file.controller.js";

import upload from "../midlewares/upload.middleware.js";

const fileRouter = Router();

fileRouter.post("/upload", upload.array("files", 5), uploadController);

export default fileRouter;
