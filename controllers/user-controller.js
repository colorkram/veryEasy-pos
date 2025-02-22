const prisma = require("../configs/prisma");
// 1. List all users
// 2. Update Role
// 3. Delete User

exports.listUsers = async (req, res, next) => {
  // code
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
    });
    // console.log(users);
    res.json({ result: users });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    console.log(id, role);
    // console.log(typeof id)
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });

    res.json({ message: "Update Success" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(id);
    res.json({ message: "Delete Success" });
  } catch (error) {
    next(error);
  }
};
