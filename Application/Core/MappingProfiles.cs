﻿using AutoMapper;
using Domain;
using Application.Activities;
using Application.Comments;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string currentUsername = null;

        CreateMap<Activity, Activity>();

        CreateMap<Activity, ActivityDto>()
            .ForMember(activityDto => activityDto.HostUsername, configuration =>
                configuration.MapFrom(activity => activity.Attendees.FirstOrDefault(activityAttendee =>
                    activityAttendee.IsHost).AppUser.UserName));

        CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(profile => profile.DisplayName, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName));

        CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(attendeeDto => attendeeDto.DisplayName, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.DisplayName))
            .ForMember(attendeeDto => attendeeDto.Username, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.UserName))
            .ForMember(attendeeDto => attendeeDto.Bio, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Bio))
            .ForMember(attendeeDto => attendeeDto.Image, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Photos.FirstOrDefault(photo =>
                    photo.IsMain).Url))
            .ForMember(attendeeDto => attendeeDto.FollowersCount, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Followers.Count))
            .ForMember(attendeeDto => attendeeDto.FollowingCount, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Followings.Count))
            .ForMember(attendeeDto => attendeeDto.Following, configuration =>
                    configuration.MapFrom(activityAttendee => activityAttendee.AppUser.Followers.Any(userFollowing =>
                        userFollowing.Observer.UserName == currentUsername)));

        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(profile => profile.Image, configuration =>
                configuration.MapFrom(appUser => appUser.Photos.FirstOrDefault(photo => photo.IsMain).Url))
            .ForMember(profile => profile.FollowersCount, configuration =>
                configuration.MapFrom(appUser => appUser.Followers.Count))
            .ForMember(profile => profile.FollowingCount, configuration =>
                configuration.MapFrom(appUser => appUser.Followings.Count))
            .ForMember(profile => profile.Following, configuration =>
                configuration.MapFrom(appUser => appUser.Followers.Any(userFollowing =>
                    userFollowing.Observer.UserName == currentUsername)));

        CreateMap<Comment, CommentDto>()
            .ForMember(commentDto => commentDto.Username, configuration =>
                configuration.MapFrom(comment => comment.Author.UserName))
            .ForMember(commentDto => commentDto.DisplayName, configuration =>
                configuration.MapFrom(comment => comment.Author.DisplayName))
            .ForMember(commentDto => commentDto.Image, configuration =>
                configuration.MapFrom(comment => comment.Author.Photos.FirstOrDefault(photo =>
                    photo.IsMain).Url));

        CreateMap<ActivityAttendee, Profiles.UserActivityDto>()
            .ForMember(userActivityDto => userActivityDto.Id, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.Activity.Id))
            .ForMember(userActivityDto => userActivityDto.Date, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.Activity.Date))
            .ForMember(userActivityDto => userActivityDto.Title, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.Activity.Title))
            .ForMember(userActivityDto => userActivityDto.Category, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.Activity.Category))
            .ForMember(userActivityDto => userActivityDto.HostUsername, configuration =>
                configuration.MapFrom(activityAttendee => activityAttendee.Activity.Attendees.FirstOrDefault(attendee =>
                    attendee.IsHost).AppUser.UserName));
    }
}