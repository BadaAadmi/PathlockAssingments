using TaskApi.Models;

namespace TaskApi.Services;

public interface ITaskService
{
    IEnumerable<TaskItem> GetAll();
    TaskItem? Get(int id);
    TaskItem Create(TaskItem item);
    bool Update(int id, TaskItem item);
    bool Delete(int id);
    bool Toggle(int id);
}
