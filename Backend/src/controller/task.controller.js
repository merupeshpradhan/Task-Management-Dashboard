import { Task } from "../models/task.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Admin: create task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo } = req.body;

  if (!title || !description || !assignedTo) {
    throw new ApiError(400, "All fields are required");
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// Admin: get all tasks
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "fullName email");
  res.status(200).json(new ApiResponse(200, tasks));
});

// Admin/User: get tasks
export const getMyTasks = asyncHandler(async (req, res) => {
  let tasks;
  if (req.user.role === "admin") {
    tasks = await Task.find().populate("assignedTo", "fullName email");
  } else {
    tasks = await Task.find({ assignedTo: req.user._id });
  }
  res.status(200).json(new ApiResponse(200, tasks));
});

// Admin/User: update task
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  if (req.user.role === "admin") {
    // Admin can edit everything including status
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    if (req.body.status) task.status = req.body.status;
  } else {
    // User can only update status
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not allowed to update this task");
    }
    if (req.body.status) {
      // Only allow 'pending' or 'completed'
      if (!["pending", "completed"].includes(req.body.status)) {
        throw new ApiError(400, "Invalid status value");
      }
      task.status = req.body.status;
    } else {
      throw new ApiError(400, "Status is required");
    }
  }

  await task.save();
  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});


// Admin: delete task
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  await task.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});
