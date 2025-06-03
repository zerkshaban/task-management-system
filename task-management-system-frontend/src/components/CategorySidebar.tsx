import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, FolderPlus } from 'lucide-react';
import { Category, Task, Stats } from '@/types/task';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  tasks: Task[];
  stats: Stats;
}

const CategorySidebar = ({
  categories,
  selectedCategory,
  onCategorySelect,
  tasks,
  stats,
}: CategorySidebarProps) => {
  const getCategoryTaskCount = (categoryName: string) => {
    return tasks.filter((task) => task.category === categoryName).length;
  };

  const allTasksCount = tasks.length;

  return (
    <div className='w-64 bg-white border-r border-gray-200 min-h-screen p-6'>
      <div className='mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
          <LayoutDashboard className='h-5 w-5' />
          Categories
        </h2>

        <div className='space-y-2'>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            className={`w-full justify-between ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onCategorySelect('all')}
          >
            <span>All Tasks</span>
            <Badge variant='secondary' className='bg-gray-100 text-gray-700'>
              {allTasksCount}
            </Badge>
          </Button>

          {categories.map((category) => {
            const taskCount = getCategoryTaskCount(category.name);
            return (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.name ? 'default' : 'ghost'
                }
                className={`w-full justify-between ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onCategorySelect(category.name)}
              >
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <Badge
                  variant='secondary'
                  className='bg-gray-100 text-gray-700'
                >
                  {taskCount}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>

      <Card className='bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'>
        <CardContent className='p-4'>
          <h3 className='font-medium text-gray-900 mb-2'>Quick Stats</h3>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Completed</span>
              <span className='font-medium text-green-600'>
                {stats.completed}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>In Progress</span>
              <span className='font-medium text-yellow-600'>
                {stats.inProgress}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Overdue</span>
              <span className='font-medium text-red-600'>{stats.overdue}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategorySidebar;
