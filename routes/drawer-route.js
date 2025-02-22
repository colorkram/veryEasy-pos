const express = require("express");
const router = express.Router();
// Import controller
const drawerControllers = require("../controllers/drawer-controller");
const { authCheck } = require("../middlewares/auth-middleware");
// @ENDPOINT http://localhost:8000/api/drawer
router.post("/drawer",authCheck, drawerControllers.createDrawer);
router.patch("/drawer/:id", authCheck, drawerControllers.updateDrawer);

router.get("/lastdrawer/:user_id", authCheck, drawerControllers.lastDrawer);
router.get("/alldrawer/:user_id", authCheck, drawerControllers.findAll);
router.get("/drawer/:findOne", authCheck, drawerControllers.findOne);
router.get("/test", (req, res) => {
  res.send("hello");
});
module.exports = router;
