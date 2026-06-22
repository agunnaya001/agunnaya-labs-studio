import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import compileRouter from "./compile";
import deployRouter from "./deploy";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(chatRouter);
router.use(compileRouter);
router.use(deployRouter);

export default router;
