import { Router } from "express";

import {
  uploadController,
  downloadController,
  renameController,
  recycleController,
  deleteController,
} from "../controllers/file.controller.js";

import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const fileRouter = Router();

fileRouter.post("/upload", auth, upload.array("files", 5), uploadController);
fileRouter.get("/download/:id", auth, downloadController);
fileRouter.patch("/rename", auth, renameController);
fileRouter.patch("/recycle", auth, recycleController);
fileRouter.delete("/delete", auth, deleteController);

export default fileRouter;
