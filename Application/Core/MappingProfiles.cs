using AutoMapper;
using Domain;
using Application.Activities;
using Application.Comments;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();

        CreateMap<Activity, ActivityDto>().ForMember(activityDto => activityDto.HostUsername,
            configuration => configuration.MapFrom(activity =>
                activity.Attendees.FirstOrDefault(activityAttendee => activityAttendee.IsHost).AppUser.UserName));

        CreateMap<ActivityAttendee, Profiles.Profile>().ForMember(profile => profile.DisplayName,
                configuration => configuration.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName));

        CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(attendeeDto => attendeeDto.DisplayName,
                configuration => configuration.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
            .ForMember(attendeeDto => attendeeDto.Username,
                configuration => configuration.MapFrom(activityAttendee => activityAttendee.AppUser.UserName))
            .ForMember(attendeeDto => attendeeDto.Bio,
                configuration => configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Bio))
            .ForMember(attendeeDto => attendeeDto.Image,
                configuration => configuration.MapFrom(activityAttendee =>
                    activityAttendee.AppUser.Photos.FirstOrDefault(photo => photo.IsMain).Url));

        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(profile => profile.Image, configuration =>
                configuration.MapFrom(user => user.Photos.FirstOrDefault(photo => photo.IsMain).Url));

        CreateMap<Comment, CommentDto>()
            .ForMember(commentDto => commentDto.DisplayName,
                configuration => configuration.MapFrom(comment => comment.Author.DisplayName))
            .ForMember(commentDto => commentDto.Username,
                configuration => configuration.MapFrom(comment => comment.Author.UserName))
            .ForMember(commentDto => commentDto.Image,
                configuration => configuration.MapFrom(comment =>
                    comment.Author.Photos.FirstOrDefault(photo => photo.IsMain).Url));
    }
}