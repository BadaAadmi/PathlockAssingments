namespace TaskApi.Models;

public class TaskItem
{
    // Use integer Id per assignment requirements
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}
