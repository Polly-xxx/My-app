const tasks = [
  { id: 1, title: "Изучить архитектуру Express", completed: true },
  { id: 2, title: "Создать итоговый проект", completed: false }
];

export const taskModel = {
  getAll: () => tasks,
  getById: (id) => tasks.find(t => t.id === id)
};
