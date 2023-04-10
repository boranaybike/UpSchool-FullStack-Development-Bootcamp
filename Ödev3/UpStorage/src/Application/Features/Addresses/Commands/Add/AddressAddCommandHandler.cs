using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;

namespace Application.Features.Addresses.Commands.Add
{
    public class AddressAddCommandHandler : IRequestHandler<AddressAddCommand, Response<int>>
    {

        private readonly IApplicationDbContext _applicationDbContext;

        public AddressAddCommandHandler(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        public async Task<Response<int>> Handle(AddressAddCommand request, CancellationToken cancellationToken)
        {

            var address = new Address()
            {
                Name = request.Name,
                CountryId = request.CountryId,
                UserId = request.UserId,
                CityId = request.CityId,
                District = request.District,
                PostCode = request.PostCode,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                AddressType = request.AddressType,
                IsDeleted = false,
                CreatedOn = DateTimeOffset.Now,
                CreatedByUserId = null,

            };

            await _applicationDbContext.Addresses.AddAsync(address, cancellationToken);

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return new Response<int>($"The new addres named \"{address.Name}\" was successfully added.", address.Id);

        }
    }
}
