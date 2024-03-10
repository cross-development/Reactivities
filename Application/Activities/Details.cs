using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using MediatR;
using Persistence;
using Application.Core;

namespace Application.Activities;

public class Details
{
    public class Query : IRequest<Result<ActivityDto>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<ActivityDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(activityDto => activityDto.Id == request.Id, cancellationToken);


            return Result<ActivityDto>.Success(activity);
        }
    }
}