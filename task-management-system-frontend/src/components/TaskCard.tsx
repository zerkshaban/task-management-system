
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Calendar, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Task, Priority } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getPriorityColor(task.priority)} group hover:scale-105`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                {task.status.replace('-', ' ')}
              </Badge>
              <div className="flex items-center gap-1">
                {getPriorityIcon(task.priority)}
                <span className="text-xs text-gray-600 capitalize">{task.priority}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task._id)}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {task.category}
          </Badge>
          
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {isOverdue && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            ⚠️ Overdue
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
