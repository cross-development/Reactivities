using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Domain;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(IEnumerable<Activity>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new List.Query());
    }

    [HttpGet("{id:guid}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(Activity), StatusCodes.Status200OK)]
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return await Mediator.Send(new Details.Query { Id = id });
    }

    [HttpPost]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        await Mediator.Send(new Create.Command { Activity = activity });

        return Ok();
    }

    [HttpPut("{id:guid}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
        activity.Id = id;

        await Mediator.Send(new Edit.Command { Activity = activity });

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        await Mediator.Send(new Delete.Command { Id = id });

        return Ok();
    }
}
