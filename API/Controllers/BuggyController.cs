using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("bad-request")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    [HttpGet("server-error")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("unauthorised")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult GetUnauthorised()
    {
        return Unauthorized();
    }
}
