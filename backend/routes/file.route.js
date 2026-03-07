import { Router } from "express";

import {
  myFilesController,
  favoriteFilesController,
  sharedFilesController,
  recycledFilesController,
  uploadController,
  downloadController,
  renameController,
  recycleController,
  restoreController,
  deleteController,
} from "../controllers/file.controller.js";

import auth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const fileRouter = Router();

fileRouter.get("/mine", auth, myFilesController);
fileRouter.get("/favorite", auth, favoriteFilesController);
fileRouter.get("/shared", auth, sharedFilesController);
fileRouter.get("/recycled", auth, recycledFilesController);

fileRouter.post("/upload", auth, upload.array("files", 5), uploadController);
fileRouter.get("/download/:id", auth, downloadController);
fileRouter.patch("/rename", auth, renameController);
fileRouter.patch("/recycle", auth, recycleController);
fileRouter.patch("/restore", auth, restoreController);
fileRouter.delete("/delete", auth, deleteController);

export default fileRouter;
