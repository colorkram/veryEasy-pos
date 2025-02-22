const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const toThaiTimeZone = require("../utils/toThaiTimeFormatted");

exports.createMenu = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { name, price, img, category_id, user_id } = req.body;

    // Step 2 validate user exists
    const checkUser = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!checkUser) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    // Step 3 Create Menu
    const menu = await prisma.menu.create({
      data: {
        name,
        price: Math.round(price * 100), // แปลงราคาเป็น Integer (หน่วยเซนต์)
        img,
        category_id,
        user_id,
      },
    });

    // Step 4 Response
    res.json({
      message: "Menu created successfully",
      menu: {
        id: menu.id,
        name: menu.name,
        price: menu.price / 100, // แสดงราคาเป็นค่าทศนิยม
        img: menu.img,
        category_id: menu.category_id,
        user_id: menu.user_id,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      },
    });
  } catch (error) {
    console.log("Error in creating menu:", error);
    next(error);
  }
};

exports.updateMenu = async (req, res, next) => {
  try {
    // Step 1: Extract data from req.body and req.params
    const { name, price, img, category_id, user_id } = req.body;
    const { id } = req.params; // Menu ID from the URL

    // Step 2: Validate if the menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Step 3: Check if the user_id matches the user associated with the menu (optional security check)
    if (menu.user_id !== user_id) {
      return res.status(403).json({ message: "Unauthorized to update this menu" });
    }

    // Step 4: Update the menu
    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: Math.round(price * 100), // Convert price to integer (cents)
        img,
        category_id,
        user_id, // You can skip this field if it's not allowed to be updated by the user
      },
    });

    // Step 5: Return the updated menu in the response
    res.json({
      message: "Menu updated successfully",
      menu: {
        id: updatedMenu.id,
        name: updatedMenu.name,
        price: updatedMenu.price / 100, // Convert price back to decimal
        img: updatedMenu.img,
        category_id: updatedMenu.category_id,
        user_id: updatedMenu.user_id,
        createdAt: updatedMenu.createdAt,
        updatedAt: updatedMenu.updatedAt,
      },
    });
  } catch (error) {
    console.log("Error in updating menu:", error);
    next(error);
  }
};



exports.findAll = async (req, res, next) => {
  try {
    const { user_id } = req.params; // ดึง user_id จาก URL

    if ( parseInt(user_id) !== req.user.id) {
      return res.status(400).json({ message: "Invalid user_id" });
    }
    const menu = await prisma.menu.findMany({
      where: {
        user_id: parseInt(user_id) // แปลง user_id เป็นตัวเลข
      },
      orderBy: {
        createdAt: 'desc' // เ
      },
    });

    res.json(menu); // ส่งคืนข้อมูลทั้งหมด
  } catch (error) {
    next(error);
  }
};

exports.findMenusByCategoryId = async (req, res, next) => {
  try {
    const { category_id } = req.params; // Get category_id from URL
    const categoryId = parseInt(category_id, 10); // Ensure category_id is an integer

    // Step 1: Validate if category_id is a valid number
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category_id" });
    }

    // Step 2: Fetch all menus related to the specified category_id
    const menus = await prisma.menu.findMany({
      where: {
        category_id: categoryId, // Filter menus by category_id
      },
    });

    // Step 3: Check if menus exist for the category
    if (menus.length === 0) {
      return res.status(404).json({ message: "No menus found for this category" });
    }

    // Step 4: Return the menus found
    res.json({
      message: "Menus found successfully",
      menus,
    });
  } catch (error) {
    console.error("Error in finding menus by category:", error);
    next(error);
  }
};

