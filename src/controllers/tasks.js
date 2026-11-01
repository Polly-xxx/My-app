import { taskService } from '../services/tasks.js';

export const getTasks = (req, res, next) => {
    try {
        const tasks = taskService.getTasksList();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};
