import { Router } from "express";

import { register, login, logout, user } from "../controllers/authController.js";
import { index as categoriesIndex } from "../controllers/categoryController.js";
import { index as workersIndex } from "../controllers/workerController.js";
import { index as dashboardIndex } from "../controllers/dashboardController.js";
import {
    index as reportsIndex,
    store as reportsStore,
    show as reportsShow,
    update as reportsUpdate,
    updateStatus as reportsUpdateStatus,
    destroy as reportsDestroy,
    reportImageUpload,
} from "../controllers/reportController.js";
import {
    index as assignmentsIndex,
    store as assignmentsStore,
    show as assignmentsShow,
    updateStatus as assignmentsUpdateStatus,
} from "../controllers/assignmentController.js";
import {
    index as reportUpdatesIndex,
    store as reportUpdatesStore,
    show as reportUpdatesShow,
} from "../controllers/reportUpdateController.js";
import {
    index as notificationsIndex,
    show as notificationsShow,
    markAsRead as notificationsMarkAsRead,
    markAllAsRead as notificationsMarkAllAsRead,
    destroy as notificationsDestroy,
} from "../controllers/notificationController.js";
import { stats as publicStats, reports as publicReports } from "../controllers/publicController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const auth = (...handlers) => [requireAuth, ...handlers];

router.post("/register", register);
router.post("/login", login);

router.get("/public/stats", publicStats);
router.get("/public/reports", publicReports);

router.get("/user", auth(user));
router.post("/logout", auth(logout));

router.get("/categories", auth(categoriesIndex));

router.get("/workers", auth(workersIndex));

router.get("/dashboard", auth(dashboardIndex));

router.get("/reports", auth(reportsIndex));
router.post("/reports", auth(reportImageUpload.single("image"), reportsStore));
router.get("/reports/:report", auth(reportsShow));
router.put("/reports/:report", auth(reportsUpdate));
router.patch("/reports/:report/status", auth(reportsUpdateStatus));
router.delete("/reports/:report", auth(reportsDestroy));

router.get("/assignments", auth(assignmentsIndex));
router.post("/assignments", auth(assignmentsStore));
router.get("/assignments/:assignment", auth(assignmentsShow));
router.patch("/assignments/:assignment/status", auth(assignmentsUpdateStatus));

router.get("/reports/:report/updates", auth(reportUpdatesIndex));
router.post("/reports/:report/updates", auth(reportUpdatesStore));
router.get("/report-updates/:reportUpdate", auth(reportUpdatesShow));

router.get("/notifications", auth(notificationsIndex));
router.patch("/notifications/read-all", auth(notificationsMarkAllAsRead));
router.get("/notifications/:notification", auth(notificationsShow));
router.patch("/notifications/:notification/read", auth(notificationsMarkAsRead));
router.delete("/notifications/:notification", auth(notificationsDestroy));

export default router;
