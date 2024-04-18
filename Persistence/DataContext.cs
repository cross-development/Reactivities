using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Domain;

namespace Persistence;

public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>(typeBuilder => typeBuilder.HasKey(activityAttendee =>
            new { activityAttendee.AppUserId, activityAttendee.ActivityId }));

        builder.Entity<ActivityAttendee>()
            .HasOne(activityAttendee => activityAttendee.AppUser)
            .WithMany(appUser => appUser.Activities)
            .HasForeignKey(activityAttendee => activityAttendee.AppUserId);

        builder.Entity<ActivityAttendee>()
            .HasOne(activityAttendee => activityAttendee.Activity)
            .WithMany(appUser => appUser.Attendees)
            .HasForeignKey(activityAttendee => activityAttendee.ActivityId);

        builder.Entity<Comment>()
            .HasOne(comment => comment.Activity)
            .WithMany(comment => comment.Comments)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserFollowing>(typeBuilder =>
        {
            typeBuilder.HasKey(userFollowing => new { userFollowing.ObserverId, userFollowing.TargetId });

            typeBuilder.HasOne(userFollowing => userFollowing.Observer)
                .WithMany(appUser => appUser.Followings)
                .HasForeignKey(userFollowing => userFollowing.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

            typeBuilder.HasOne(userFollowing => userFollowing.Target)
                .WithMany(appUser => appUser.Followers)
                .HasForeignKey(userFollowing => userFollowing.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}