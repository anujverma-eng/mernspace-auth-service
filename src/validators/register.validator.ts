import { checkSchema } from "express-validator";
import { ROLES } from "../constants";

export default checkSchema({
  firstName: {
    errorMessage: "First Name field is required",
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: "Last Name field is required",
    notEmpty: true,
    trim: true,
  },
  email: {
    isEmail: {
      errorMessage: "Email should be a valid email",
    },
    notEmpty: true,
    trim: true,
  },
  password: {
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password length should be at least 8 chars!",
    },
    notEmpty: true,
    trim: true,
    isStrongPassword: true,
  },
  role: {
    default: {
      options: ROLES.CUSTOMER,
    },
    optional: true,
    errorMessage: "unable to add role",
    isIn: {
      options: [ROLES.ADMIN, ROLES.CUSTOMER, ROLES.MANAGER],
    },
  },
});
