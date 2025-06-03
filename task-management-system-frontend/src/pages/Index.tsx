import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import CategorySidebar from '@/components/CategorySidebar';
import { Task, TaskPayload, Category, Priority, Stats } from '@/types/task';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    highPriority: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/tasks')
      .then((res) => {
        const response = res.data;
        setTasks(response.data.tasks || []);
        setStats(
          response.data.stats || {
            total: 0,
            inProgress: 0,
            completed: 0,
            overdue: 0,
            highPriority: 0,
          }
        );
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to fetch tasks:', err);
      });
  }, []);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Design', color: '#8B5CF6', taskCount: 1 },
    { id: '2', name: 'Development', color: '#06B6D4', taskCount: 1 },
    { id: '3', name: 'Research', color: '#10B981', taskCount: 1 },
    { id: '4', name: 'Marketing', color: '#F59E0B', taskCount: 0 },
  ]);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || task.status === filterStatus;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const handleCreateTask = (taskData: TaskPayload) => {
    const newTask = taskData;
    axios
      .post('http://localhost:3000/api/tasks', newTask)
      .then(() => {
        // Refresh tasks list after successful creation
        return axios.get('http://localhost:3000/api/tasks');
      })
      .then((res) => {
        const response = res.data;
        setTasks(response.data.tasks || []);
        setStats(
          response.data.stats || {
            total: 0,
            inProgress: 0,
            completed: 0,
            overdue: 0,
            highPriority: 0,
          }
        );
        setIsTaskFormOpen(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to create/fetch tasks:', err);
      });
  };

  const handleUpdateTask = (taskData: TaskPayload) => {
    if (!editingTask) return;

    axios
      .put(`http://localhost:3000/api/tasks/${editingTask._id}`, taskData)
      .then(() => {
        // Refresh tasks list after successful creation
        return axios.get('http://localhost:3000/api/tasks');
      })
      .then((res) => {
        const response = res.data;
        setTasks(response.data.tasks || []);
        setStats(
          response.data.stats || {
            total: 0,
            inProgress: 0,
            completed: 0,
            overdue: 0,
            highPriority: 0,
          }
        );
        setEditingTask(null);
        setIsTaskFormOpen(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to create/fetch tasks:', err);
      });
  };

  const handleDeleteTask = (taskId: string) => {
    axios
      .delete(`http://localhost:3000/api/tasks/${taskId}`)
      .then(() => {
        // Refresh tasks list after successful deletion
        return axios.get('http://localhost:3000/api/tasks');
      })
      .then((res) => {
        const response = res.data;
        setTasks(response.data.tasks || []);
        setStats(
          response.data.stats || {
            total: 0,
            inProgress: 0,
            completed: 0,
            overdue: 0,
            highPriority: 0,
          }
        );
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to delete/fetch tasks:', err);
      });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      case 'medium':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'low':
        return <CheckCircle2 className='h-4 w-4 text-green-500' />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='flex'>
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          tasks={tasks}
          stats={stats}
        />

        <main className='flex-1 p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                Task Manager
              </h1>
              <p className='text-gray-600'>
                Organize your work and boost productivity
              </p>
            </div>

            {/* Controls */}
            <div className='mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
              <div className='flex flex-col sm:flex-row gap-4 flex-1'>
                <div className='relative flex-1 max-w-md'>
                  <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    placeholder='Search tasks...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='all'>All Status</option>
                  <option value='todo'>To Do</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskFormOpen(true);
                }}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
              >
                <Plus className='h-4 w-4 mr-2' />
                New Task
              </Button>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
              <Card className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>Total Tasks</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {tasks.length}
                      </p>
                    </div>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                      <Calendar className='h-6 w-6 text-blue-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>Completed</p>
                      <p className='text-2xl font-bold text-green-600'>
                        {tasks.filter((t) => t.status === 'completed').length}
                      </p>
                    </div>
                    <div className='p-2 bg-green-100 rounded-lg'>
                      <CheckCircle2 className='h-6 w-6 text-green-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>In Progress</p>
                      <p className='text-2xl font-bold text-yellow-600'>
                        {tasks.filter((t) => t.status === 'in-progress').length}
                      </p>
                    </div>
                    <div className='p-2 bg-yellow-100 rounded-lg'>
                      <Clock className='h-6 w-6 text-yellow-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>High Priority</p>
                      <p className='text-2xl font-bold text-red-600'>
                        {tasks.filter((t) => t.priority === 'high').length}
                      </p>
                    </div>
                    <div className='p-2 bg-red-100 rounded-lg'>
                      <AlertTriangle className='h-6 w-6 text-red-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className='text-center py-12'>
                <div className='w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <Calendar className='h-12 w-12 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No tasks found
                </h3>
                <p className='text-gray-600 mb-4'>
                  Get started by creating your first task!
                </p>
                <Button onClick={() => setIsTaskFormOpen(true)}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Task
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  );
};

export default Index;
