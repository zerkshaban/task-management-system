export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
  __v: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface Stats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
}
