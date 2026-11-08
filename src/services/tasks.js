import { taskModel } from '../models/tasks.js';

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
