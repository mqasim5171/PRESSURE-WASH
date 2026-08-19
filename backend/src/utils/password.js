// Pure-JS bcrypt (bcryptjs) - deliberately not the native `bcrypt` package,
// which requires compiling a C++ addon on install. On managed hosting where
// we don't control the build toolchain, a pure-JS implementation is the
// safer choice even though it's marginally slower.
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, verifyPassword };
