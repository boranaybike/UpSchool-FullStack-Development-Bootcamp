using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
namespace Application.Features.Addresses.Commands.Delete
{
    public class AddressDeleteCommandHandler : IRequestHandler<AddressDeleteCommand, Response<int>>
    {

        private readonly IApplicationDbContext _applicationDbContext;

        public AddressDeleteCommandHandler(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        public async Task<Response<int>> Handle(AddressDeleteCommand request, CancellationToken cancellationToken)
        {
            var address = _applicationDbContext.Addresses.FirstOrDefault(x => x.Id == request.Id);

            if(address == null)
            {
                throw new ArgumentException();
            }

            address.IsDeleted = true;
            address.DeletedOn = DateTimeOffset.Now;
            address.DeletedByUserId = request.UserId;

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return new Response<int>($"successfully deleted.", address.Id);
        }


    }
}
