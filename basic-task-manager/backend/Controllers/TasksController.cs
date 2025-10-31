using Microsoft.AspNetCore.Mvc;
using TaskApi.Models;
using TaskApi.Services;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _svc;
    public TasksController(ITaskService svc) => _svc = svc;

    [HttpGet]
    public ActionResult<IEnumerable<TaskItem>> Get() => Ok(_svc.GetAll());

        [HttpGet("{id}")]
        public ActionResult<TaskItem> Get(int id)
        {
            var item = _svc.Get(id);
            return item is null ? NotFound() : Ok(item);
        }

    [HttpPost]
    public ActionResult<TaskItem> Create([FromBody] TaskItem item)
    {
        var created = _svc.Create(item);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] TaskItem item)
    {
        if (!_svc.Update(id, item)) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (!_svc.Delete(id)) return NotFound();
        return NoContent();
    }

    // Toggle completion using PUT /api/tasks/{id}/toggle as specified in the assignment
    [HttpPut("{id}/toggle")]
    public IActionResult Toggle(int id)
    {
        if (!_svc.Toggle(id)) return NotFound();
        return NoContent();
    }
}
