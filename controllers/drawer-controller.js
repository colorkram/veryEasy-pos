const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const toThaiTimeZone = require("../utils/toThaiTimeFormatted");

exports.createDrawer = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { start_money, user_id } = req.body;
    // Step 2 validate
    // Step 3 Check already
    const checkEmail = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });
    if (!checkEmail) {
      return createError(400, "error createDrawer");
    }
    
    const drawer = await prisma.drawer.create({
      data: {
        start_money: start_money,
        user_id: user_id,
      },
    });
    // Step 6 Response
    res.json({ message: "drawer Success" });
  } catch (error) {
    console.log("Step 2 Catch");
    next(error);
  }
};

exports.updateDrawer = async (req, res, next) => {
  try {
    // Step 1: Extract `id` from params and data from body
    const { id } = req.params;
    const { start_money, sale_money, exp_drawer, act_drawer, close_date } = req.body;

    // Step 2: Validate that `id` is provided
    if (!id) {
      return res.status(400).json({ message: "Drawer ID is required" });
    }

    // Ensure numbers are valid
    const calculatedDif =
      act_drawer != null && exp_drawer != null ? act_drawer - exp_drawer : null;

    // Use current timestamp if `close_date` is not provided
    const finalCloseDate = close_date ? new Date(close_date) : new Date();

    // Step 3: Update the drawer
    const updatedDrawer = await prisma.drawer.update({
      where: { id: parseInt(id) }, // Ensure `id` is an integer
      data: {
        start_money,
        sale_money,
        exp_drawer,
        act_drawer,
        dif: calculatedDif, // Handle null values safely
        close_date: finalCloseDate, // Use proper timestamp
      },
    });

    // Step 4: Respond with the updated drawer
    res.json({ message: "Drawer updated successfully", drawer: updatedDrawer });
  } catch (error) {
    console.log("Step 2 Catch", error);
    next(error);
  }
};


exports.lastDrawer = async (req, res, next) => {
  try {
    const { user_id } = req.params; // Get user_id from URL
    const userId = parseInt(user_id, 10); // Ensure user_id is an integer

    // ตรวจสอบว่า user_id จาก URL และ user_id จาก req.user.id ตรงกันหรือไม่
    if (isNaN(userId) || userId !== req.user.id) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    // ดึงข้อมูล drawer ที่ยังไม่ได้ปิด
    const drawer = await prisma.drawer.findFirst({
      where: { close_date: null, user_id: userId },
    });

    // ถ้าไม่พบ drawer
    if (!drawer) {
      return res.status(404).json({ message: "No open drawer found for this user" });
    }

    // ส่งข้อมูลพร้อมแปลงเวลาเป็นเวลาประเทศไทย
    res.json({
      ...drawer,
      open_date: toThaiTimeZone(drawer.open_date),
    });
  } catch (error) {
    console.error("Error fetching last drawer:", error);
    next(error);
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const { findOne } = req.params; 
    console.log(findOne);
    
    const drawer1 = await prisma.drawer.findFirst({
      where: { 
       id:parseInt(findOne)
      },
    });

    res.json(drawer1); // เปลี่ยนจาก users เป็น drawer
  } catch (error) {
    next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { user_id } = req.params; // ดึง user_id จาก URL

    if ( parseInt(user_id) !== req.user.id) {
      return res.status(400).json({ message: "Invalid user_id" });
    }
    const drawers = await prisma.drawer.findMany({
      where: {
        user_id: parseInt(user_id) // แปลง user_id เป็นตัวเลข
      },
      orderBy: {
        open_date: 'asc' // เรียงลำดับตาม open_date จากน้อยไปมาก (asc)
      },
    });

    res.json(drawers); // ส่งคืนข้อมูลทั้งหมด
  } catch (error) {
    next(error);
  }
};
