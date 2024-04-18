using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Core;
using Application.Interfaces;
using Domain;
using Persistence;

namespace Application.Activities;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
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
            var activity = await _context.Activities
                .Include(activity => activity.Attendees)
                .ThenInclude(activityAttendee => activityAttendee.AppUser)
                .SingleOrDefaultAsync(activity => activity.Id == request.Id, cancellationToken);

            if (activity == null)
            {
                return null;
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername(), cancellationToken);

            if (user == null)
            {
                return null;
            }

            var hostUsername = activity.Attendees.FirstOrDefault(attendee => attendee.IsHost)?.AppUser?.UserName;

            var attendance = activity.Attendees.FirstOrDefault(attendee => attendee.AppUser.UserName == user.UserName);

            if (attendance != null && hostUsername == user.UserName)
            {
                activity.IsCanceled = !activity.IsCanceled;
            }

            if (attendance != null && hostUsername != user.UserName)
            {
                activity.Attendees.Remove(attendance);
            }

            if (attendance == null)
            {
                attendance = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false,
                };

                activity.Attendees.Add(attendance);
            }

            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
        }
    }
}