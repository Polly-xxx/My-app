import { taskModel } from '../models/task.js';

export const taskService = {
    getTasksList: () => {
        return taskModel.getAll();
    },
    getTask: (id) => {
        const task = taskModel.getById(id);
        if (!task) return null;
        return task;
    }
};
