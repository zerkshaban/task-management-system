import { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Task, Category, Priority, Status } from '@/types/task';

type TaskFormData = {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: Status;
  dueDate: string;
};

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskFormData) => void;
  task?: Task | null;
  categories: Category[];
}

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  categories,
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: moment(task.dueDate).format('YYYY-MM-DD'),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0]?.name || '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
      });
    }
  }, [task, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?.name || '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-900'>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label
              htmlFor='title'
              className='text-sm font-medium text-gray-700'
            >
              Title *
            </Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='Enter task title'
              required
              className='mt-1'
            />
          </div>

          <div>
            <Label
              htmlFor='description'
              className='text-sm font-medium text-gray-700'
            >
              Description
            </Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder='Enter task description'
              className='mt-1 min-h-[80px]'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='category'
                className='text-sm font-medium text-gray-700'
              >
                Category *
              </Label>
              <select
                id='category'
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
                className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label
                htmlFor='priority'
                className='text-sm font-medium text-gray-700'
              >
                Priority
              </Label>
              <select
                id='priority'
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label
                htmlFor='status'
                className='text-sm font-medium text-gray-700'
              >
                Status
              </Label>
              <select
                id='status'
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='todo'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>
            </div>

            <div>
              <Label
                htmlFor='dueDate'
                className='text-sm font-medium text-gray-700'
              >
                Due Date *
              </Label>
              <Input
                id='dueDate'
                type='date'
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
                className='mt-1'
              />
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
