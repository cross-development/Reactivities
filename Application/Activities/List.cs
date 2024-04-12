using AutoMapper.QueryableExtensions;
using AutoMapper;
using MediatR;
using Persistence;
using Application.Core;
using Application.Interfaces;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PagedList<ActivityDto>>>
    {
        public ActivityParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Activities
                .Where(activity => activity.Date >= request.Params.StartDate)
                .OrderBy(activity => activity.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                .AsQueryable();

            if (request.Params.IsGoing && !request.Params.IsHost)
            {
                query = query
                    .Where(activity => activity.Attendees
                        .Any(attendee => attendee.Username == _userAccessor.GetUsername()));
            }

            if (request.Params.IsHost && !request.Params.IsGoing)
            {
                query = query
                    .Where(activity => activity.HostUsername == _userAccessor.GetUsername());
            }

            var activities = await PagedList<ActivityDto>
                .CreateAsync(query, request.Params.PageNumber, request.Params.PageSize, cancellationToken);

            return Result<PagedList<ActivityDto>>.Success(activities);
        }
    }
}