using Application.Common.Interfaces;
using Domain.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Addresses.Commands.Update
{
    public class AddressUpdateCommandHandler : IRequestHandler<AddressUpdateCommand, Response<int>>
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public AddressUpdateCommandHandler(IApplicationDbContext context)
        {
            _applicationDbContext = context;
        }
        public async Task<Response<int>> Handle(AddressUpdateCommand request, CancellationToken cancellationToken)
        {
            var address = _applicationDbContext.Addresses.FirstOrDefault(x => x.Id == request.Id);

            address.AddressLine1 = request.AddressLine1;
            address.AddressLine2 = request.AddressLine2;
            address.CityId = request.CityId;
            address.CountryId = request.CountryId;
            address.ModifiedOn = DateTimeOffset.Now;
            address.ModifiedByUserId = null;
            address.District = request.District;
            address.Name = request.Name;
            address.PostCode = request.PostCode;
            address.AddressType = (AddressType)request.AddressType;

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return new Response<int>($"The addres named \"{address.Name}\" was successfully updated.", address.Id);
        }
    }
}
