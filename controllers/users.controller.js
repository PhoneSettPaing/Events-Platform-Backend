const {
  selectUsers,
  updateUserById,
  updateUserRole,
  selectUserById,
} = require("../models/users.model");

exports.getUsers = (req, res) => {
  return selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;

  return selectUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchUserById = (req, res, next) => {
  const { user_id } = req.params;
  const { full_name, avatar_url } = req.body;

  if (!full_name && !avatar_url) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field!",
    });
  }

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingUserUpdate = updateUserById(avatar_url, full_name, user_id);

  Promise.all([pendingUserIdCheck, pendingUserUpdate])
    .then(([_, user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchUserRole = (req, res, next) => {
  const { user_id } = req.params;
  const { role } = req.body;

  const acceptableRoles = ["user", "staff"];
  if (!role || !acceptableRoles.includes(role)) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field or invalid role!",
    });
  }

  const pendingUserIdCheck = selectUserById(user_id);
  const pendingUserRoleUpdate = updateUserRole(user_id, role);

  Promise.all([pendingUserIdCheck, pendingUserRoleUpdate])
    .then(([_, user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
