const db = require("../../data/dbConfig.js");

module.exports = {
  getAll,
  create,
  findUsername,
  findByID,
};

async function getAll() {
  const users = await db("users");
  return users;
}

async function create(user) {
  try {
    const [{ id }] = await db("users").insert(user, ["id"]);
    return findByID(id);
  } catch (error) {
    if (error.constraint.includes("username_unique")) {
      throw new Error("Username is taken. Please try another.");
    }
  }
}

async function findUsername(userInfo) {
  const user = await db("users")
    .where({ username: userInfo })
    .orWhere({ email: userInfo })
    .first();
  return user;
}

async function findByID(id) {
  const { password, ...user } = await db("users").where({ id }).first();
  return user;
}