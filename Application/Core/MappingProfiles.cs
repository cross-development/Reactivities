using AutoMapper;
using Domain;
using Application.Activities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();

        CreateMap<Activity, ActivityDto>().ForMember(activityDto => activityDto.HostUsername,
            configurationExpression => configurationExpression.MapFrom(activity =>
                activity.Attendees.FirstOrDefault(activityAttendee => activityAttendee.IsHost).AppUser.UserName));

        CreateMap<ActivityAttendee, Profiles.Profile>().ForMember(profile => profile.DisplayName,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName));

        CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(profile => profile.DisplayName,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
            .ForMember(profile => profile.Username,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.UserName))
            .ForMember(profile => profile.Bio,
                configurationExpression =>
                    configurationExpression.MapFrom(activityAttendee => activityAttendee.AppUser.Bio));
    }
}