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
            expression => expression.MapFrom(activity =>
                activity.Attendees.FirstOrDefault(activityAttendee => activityAttendee.IsHost).AppUser.UserName));

        CreateMap<ActivityAttendee, Profiles.Profile>().ForMember(profile => profile.DisplayName,
                expression => expression.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName));

        CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(attendee => attendee.DisplayName,
                expression => expression.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
            .ForMember(attendee => attendee.Username,
                expression => expression.MapFrom(activityAttendee => activityAttendee.AppUser.UserName))
            .ForMember(attendee => attendee.Bio,
                expression => expression.MapFrom(activityAttendee => activityAttendee.AppUser.Bio))
            .ForMember(attendee => attendee.Image,
                expression => expression.MapFrom(activityAttendee =>
                    activityAttendee.AppUser.Photos.FirstOrDefault(photo => photo.IsMain).Url));

        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(profile => profile.Image, expression =>
                expression.MapFrom(user => user.Photos.FirstOrDefault(photo => photo.IsMain).Url));
    }
}