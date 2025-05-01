import { prisma } from "../utils/prismaInstance.js";
import { loginSchema, signUpSchema } from "../schemas/auth.schema.js";
import { checkIfExists, createToken, formatErrors } from "../utils/utils.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const data = req.body;

  // Validate incoming data
  const { value, error } = signUpSchema.validate(data, {
    abortEarly: true,
  });

  if (error) {
    const formattedErrors = formatErrors(error);
    return res.status(400).json(formattedErrors); // Send the formatted errors
  }

  // Check if username exists
  const existingUser = await checkIfExists("username", value.username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  // Check if email exists
  const existingEmail = await checkIfExists("email", value.email);
  if (existingEmail) {
    return res.status(400).json({ message: "Email already taken" });
  }

  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(value.password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: { ...value, password: hashedPassword },
    });

    // Remove sensitive data before sending response
    const sanitizedUser = {
      username: newUser.username,
      firstname: newUser.firstname,
      surname: newUser.surname,
      avatar: newUser.avatar,
      id: newUser.id,
    };

    // Create JWT token
    const token = createToken({ id: newUser.id });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response with user info (excluding password and email)
    return res.status(200).json(sanitizedUser);
  } catch (error) {
    console.error("Error signing up user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const data = req.body;

  const { value, error } = loginSchema.validate(data, { abortEarly: true });

  if (error) {
    const formattedErrors = formatErrors(error);
    return res.status(400).json(formattedErrors);
  }

  const existingUser = await checkIfExists("username", value.username);
  if (!existingUser) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const verifyPassword = await bcrypt.compare(
    value.password,
    existingUser.password
  );
  if (!verifyPassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  try {
    const sanitizedUser = {
      username: existingUser.username,
      firstname: existingUser.firstname,
      surname: existingUser.surname,
      avatar: existingUser.avatar,
      id: existingUser.id,
    };

    const token = createToken({ id: existingUser.id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(sanitizedUser);
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
