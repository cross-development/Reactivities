using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Services;
using Domain;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _configuration = configuration;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://graph.facebook.com")
        };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
            .Include(user => user.Photos)
            .FirstOrDefaultAsync(user => user.Email == loginDto.Email);

        if (user == null)
        {
            return Unauthorized();
        }

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!result)
        {
            return Unauthorized();

        }

        await SetRefreshToken(user);

        return CreateUserObject(user);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var isUsernameExist = await _userManager.Users.AnyAsync(user => user.UserName == registerDto.Username);

        if (isUsernameExist)
        {
            ModelState.AddModelError("username", "Username is already taken");

            return ValidationProblem();
        }

        var isEmailExist = await _userManager.Users.AnyAsync(user => user.Email == registerDto.Email);

        if (isEmailExist)
        {
            ModelState.AddModelError("email", "Email is already taken");

            return ValidationProblem();
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await SetRefreshToken(user);

        return CreateUserObject(user);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.Users
            .Include(user => user.Photos)
            .FirstOrDefaultAsync(user => user.Email == User.FindFirstValue(ClaimTypes.Email));

        await SetRefreshToken(user);

        return CreateUserObject(user);
    }

    [AllowAnonymous]
    [HttpPost("fb-login")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var fbVerifyKeys = _configuration["Facebook:AppId"] + "|" + _configuration["Facebook:ApiSecret"];

        var verifyTokenResponse = await _httpClient
            .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

        if (!verifyTokenResponse.IsSuccessStatusCode)
        {
            return Unauthorized();
        }

        var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

        var fbInfo = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

        var user = await _userManager.Users
            .Include(user => user.Photos)
            .FirstOrDefaultAsync(user => user.Email == fbInfo.Email);

        if (user != null)
        {
            return CreateUserObject(user);
        }

        user = new AppUser
        {
            DisplayName = fbInfo.Name,
            Email = fbInfo.Email,
            UserName = fbInfo.Email,
            Photos = new List<Photo>
            {
                new Photo
                {
                    Id = "fb_" + fbInfo.Id,
                    IsMain = true,
                    Url = fbInfo.Picture.Data.Url
                }
            }
        };

        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest("Problem creating user account");
        }

        await SetRefreshToken(user);

        return CreateUserObject(user);
    }

    [Authorize]
    [HttpPost("refresh-token")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        var user = await _userManager.Users
            .Include(user => user.Photos)
            .Include(user => user.RefreshTokens)
            .FirstOrDefaultAsync(user => user.UserName == User.FindFirstValue(ClaimTypes.Name));

        if (user == null)
        {
            return Unauthorized();
        }

        var oldToken = user.RefreshTokens.SingleOrDefault(refresh => refresh.Token == refreshToken);

        if (oldToken != null && !oldToken.IsActive)
        {
            return Unauthorized();
        }

        if (oldToken != null)
        {
            oldToken.Revoked = DateTime.UtcNow;
        }

        return CreateUserObject(user);
    }

    private async Task SetRefreshToken(AppUser user)
    {
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshTokens.Add(refreshToken);

        await _userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
    }

    private UserDto CreateUserObject(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos?.FirstOrDefault(photo => photo.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }
}
