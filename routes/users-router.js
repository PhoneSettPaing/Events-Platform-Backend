const usersRouter = require("express").Router();
const {
  getUsers,
  patchUserById,
  patchUserRole,
  getUserById,
} = require("../controllers/users.controller");

usersRouter.get("/", getUsers);
usersRouter.route("/:user_id").get(getUserById).patch(patchUserById);
usersRouter.route("/:user_id/role").patch(patchUserRole);

module.exports = usersRouter;
