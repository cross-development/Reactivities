using System.Net.Mime;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Services;
using Domain;

namespace API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Consumes(MediaTypeNames.Application.Json)]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result)
        {
            return Unauthorized();

        }

        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = null,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var isUsernameExist = await _userManager.Users.AnyAsync(user => user.UserName == registerDto.Username);

        if (isUsernameExist)
        {
            return BadRequest("Username is already taken");
        }

        var isEmailExist = await _userManager.Users.AnyAsync(user => user.Email == registerDto.Email);

        if (isEmailExist)
        {
            return BadRequest("Email is already taken");
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }

        return BadRequest(result.Errors);
    }
}
