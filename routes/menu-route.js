

const express = require("express");
const router = express.Router();
// Import controller
const menuControllers = require("../controllers/menu-controller");
const { authCheck } = require("../middlewares/auth-middleware");
// @ENDPOINT http://localhost:8000/api/menu
router.post("/menu",authCheck, menuControllers.createMenu);
router.patch("/menu/:id", authCheck, menuControllers.updateMenu);
router.get("/allmenu/:user_id", authCheck, menuControllers.findAll);
router.get("/menubycat/:category_id", authCheck, menuControllers.findMenusByCategoryId);
// router.get("/menu/:findOne", authCheck, menuControllers.findOne);

module.exports = router;
