import { Router } from "express";
import { protect , isAdmin } from "../middlewares/authMiddleware";
import { getPurchaseSetting ,
   updatePurchaseSetting ,
    getAllOrders , 
    updateOrderStatus ,
     getDashboardStats ,
      getRecentCommissions ,
       getRecentOrders ,
        getRecentUsers ,
         getSalesChart,
         getAllUsers,
         getUserDetails,
         getUserStats,
         toggleUserStatus
         } from "../controllers/adminController";

const router = Router();

router.get(
  "/purchase-setting",
  getPurchaseSetting
);

router.put(
  "/purchase-setting",
  protect,
  isAdmin,
  updatePurchaseSetting
);


router.get(
  "/orders",
  protect,
  isAdmin,
  getAllOrders
);

router.put(
  "/orders/:orderId/status",
  protect,
  isAdmin,
  updateOrderStatus
);


router.get(
  "/dashboard/stats",
  protect,
  isAdmin,
  getDashboardStats
);

router.get(
  "/dashboard/sales-chart",
  protect,
  isAdmin,
  getSalesChart
);

router.get(
  "/dashboard/recent-orders",
  protect,
  isAdmin,
  getRecentOrders
);

router.get(
  "/dashboard/recent-users",
  protect,
  isAdmin,
  getRecentUsers
);

router.get(
  "/dashboard/recent-commissions",
  protect,
  isAdmin,
  getRecentCommissions
);

router.get(
  "/users",
  protect,
  isAdmin,
  getAllUsers
);

router.get(
  "/users/stats",
  protect,
  isAdmin,
  getUserStats
);

router.get(
  "/users/:id",
  protect,
  isAdmin,
  getUserDetails
);

router.put(
  "/users/:id/toggle-status",
  protect,
  isAdmin,
  toggleUserStatus
);

export default router;