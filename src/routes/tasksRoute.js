import express from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);
router.patch("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTask);

// router.patch('/:id/done', asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const task = await TaskModel.findById(id);
//     if (!task) {
//         return res.status(404).json({ message: 'Task not found' });
//     }

//     task.status = 'done'; // Mark task as done
//     await task.save();

//     res.status(200).json({ message: 'Task marked as done', task });
// }));

export default router;