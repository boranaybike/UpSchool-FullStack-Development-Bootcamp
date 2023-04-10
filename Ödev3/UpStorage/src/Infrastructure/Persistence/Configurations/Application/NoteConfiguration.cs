using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations.Application
{
    public class NoteConfiguration : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            // Id
            builder.HasKey(x => x.Id);

            // Title
            builder.Property(x => x.Title).IsRequired();
            builder.Property(x => x.Title).HasMaxLength(100);

            // Content
            builder.Property(x => x.Content).IsRequired();
            builder.Property(x => x.Content).HasMaxLength(1000);

            /* Common Fields */

            // CreatedByUserId
            builder.Property(x => x.CreatedByUserId).IsRequired(false);
            builder.Property(x => x.CreatedByUserId).HasMaxLength(100);

            // CreatedOn
            builder.Property(x => x.CreatedOn).IsRequired();

            // ModifiedByUserId
            builder.Property(x => x.ModifiedByUserId).IsRequired(false);
            builder.Property(x => x.ModifiedByUserId).HasMaxLength(100);

            // LastModifiedOn
            builder.Property(x => x.ModifiedOn).IsRequired(false);

            // DeletedByUserId
            builder.Property(x => x.DeletedByUserId).IsRequired(false);
            builder.Property(x => x.DeletedByUserId).HasMaxLength(100);

            // DeletedOn
            builder.Property(x => x.DeletedOn).IsRequired(false);

            // IsDeleted
            builder.Property(x => x.IsDeleted).IsRequired();
            builder.Property(x => x.IsDeleted).HasDefaultValueSql("0");

            builder.ToTable("Notes");

        }
    }
}
