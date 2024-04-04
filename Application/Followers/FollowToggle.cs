using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Core;
using Application.Interfaces;
using Domain;
using Persistence;

namespace Application.Followers;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUsername { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await _context.Users
                .FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername(), cancellationToken);

            var target = await _context.Users
                .FirstOrDefaultAsync(user => user.UserName == request.TargetUsername, cancellationToken);

            if (target == null)
            {
                return null;
            }

            var following = await _context.UserFollowings
                .FindAsync(new object[] { observer.Id, target.Id }, cancellationToken);

            if (following == null)
            {
                following = new UserFollowing
                {
                    Observer = observer,
                    Target = target,
                };

                _context.UserFollowings.Add(following);
            }
            else
            {
                _context.UserFollowings.Remove(following);
            }

            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update following");
        }
    }
}