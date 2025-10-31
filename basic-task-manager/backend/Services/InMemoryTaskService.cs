using TaskApi.Models;
using System.Collections.Concurrent;
using System.Threading;

namespace TaskApi.Services;

public class InMemoryTaskService : ITaskService
{
    // Use int keys and an auto-incrementing counter for Ids.
    private readonly ConcurrentDictionary<int, TaskItem> _items = new();
    private int _nextId = 1;

    public IEnumerable<TaskItem> GetAll() => _items.Values.OrderBy(t => t.Id);

    public TaskItem? Get(int id) => _items.TryGetValue(id, out var item) ? item : null;

    public TaskItem Create(TaskItem item)
    {
        var id = Interlocked.Increment(ref _nextId) - 1; // start at 1
        item.Id = id;
        _items[item.Id] = item;
        return item;
    }

    public bool Update(int id, TaskItem item)
    {
        if (!_items.ContainsKey(id)) return false;
        item.Id = id;
        _items[id] = item;
        return true;
    }

    public bool Delete(int id) => _items.TryRemove(id, out _);

    public bool Toggle(int id)
    {
        if (_items.TryGetValue(id, out var item))
        {
            item.IsCompleted = !item.IsCompleted;
            _items[id] = item;
            return true;
        }
        return false;
    }
}
