import { Router } from "express";
import { protect , isAdmin } from "../middlewares/authMiddleware";
import { createCommissionLevel , getCommissionLevels , updateCommissionLevel , deleteCommissionLevel , getCommissionReport} from "../controllers/commisionController";

const router = Router();

router.post("/",protect,isAdmin,createCommissionLevel);

router.get("/",protect,isAdmin,getCommissionLevels);

router.put( "/:id", protect, isAdmin,updateCommissionLevel);

router.delete("/:id",protect,isAdmin,deleteCommissionLevel);

router.get("/admin/commission-report",protect,isAdmin,getCommissionReport);


export default router;