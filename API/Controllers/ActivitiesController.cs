using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Application.Core;
using Domain;

namespace API.Controllers;

[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class ActivitiesController : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Activity>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivities([FromQuery] PagingParams param)
    {
        return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Activity), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetActivity(Guid id)
    {
        return HandleResult(await Mediator.Send(new Details.Query { Id = id }));

    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateActivity(Activity activity)
    {
        return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditActivity(Guid id, Activity activity)
    {
        activity.Id = id;

        return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
    }

    [Authorize(Policy = "IsActivityHost")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }

    [HttpPost("{id:guid}/attend")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Attend(Guid id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
    }
}
