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
        public PagingParams Params { get; set; }
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
                .OrderBy(activity => activity.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                .AsQueryable();

            var activities = await PagedList<ActivityDto>
                .CreateAsync(query, request.Params.PageNumber, request.Params.PageSize, cancellationToken);

            return Result<PagedList<ActivityDto>>.Success(activities);
        }
    }
}