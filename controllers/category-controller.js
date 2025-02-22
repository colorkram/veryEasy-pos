const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const toThaiTimeZone = require("../utils/toThaiTimeFormatted");

exports.createcategory = async (req, res, next) => {
  try {
    // Step 1 req.body
    const { name, user_id } = req.body;
console.log(user_id);

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
    const category = await prisma.category.create({
      data: {
        name,
        user_id,
      },
    });

    // Step 4 Response
    res.json({
      message: "category created successfully",
    });
  } catch (error) {
    console.log("Error in creating menu:", error);
    next(error);
  }
};


exports.findAllCategoriesByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params; // Get user_id from URL
    const userId = parseInt(user_id, 10); // Ensure user_id is an integer

    // Step 1: Validate user_id
    const checkUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!checkUser) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    // Step 2: Find all categories associated with the user and include menus
    const categories = await prisma.category.findMany({
      where: {
        menus: {
          some: {
            user_id: userId, // Filter categories by the user's menus
          },
        },
      },
      include: {
        menus: true, // Include related menus
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found for this user" });
    }

    // Step 3: Return the found categories with menus
    res.json({
      message: "Categories found successfully",
      categories,
    });
  } catch (error) {
    console.error("Error in finding categories by user:", error);
    next(error);
  }
};
