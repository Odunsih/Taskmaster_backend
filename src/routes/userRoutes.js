import express from "express";
import {
  addUserByAdmin,
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  authenticateUser,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  addTeamMember,
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);
// Admin adds a team member
router.post("/admin/add-team-member", protect, adminMiddleware, addTeamMember);
router.post("/admin/add-user", protect, adminMiddleware, addUserByAdmin);



// admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// email verification
router.post("/verify-email", protect, verifyEmail);

// veriify user --> email verification
router.post("/verify-user/:verificationToken", verifyUser);

// forgot password
router.post("/forgot-password", forgotPassword);

//reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// change password ---> user must be logged in
router.patch("/change-password", protect, changePassword);

router.patch('/profile', authenticateUser, async (req, res) => {
  const { name, password } = req.body;

  try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (password) {
          const salt = await bcrypt.genSalt(10); // Ensure bcrypt is set up
          user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



export default router;
