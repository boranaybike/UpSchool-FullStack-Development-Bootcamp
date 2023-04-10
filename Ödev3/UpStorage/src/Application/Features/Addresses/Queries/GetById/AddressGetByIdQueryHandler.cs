using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Addresses.Queries.GetById
{
    public class AddressGetByIdQueryHandler : IRequestHandler<AddressGetByIdQuery, AddressGetByIdDto>
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public AddressGetByIdQueryHandler(IApplicationDbContext context)
        {
            _applicationDbContext = context;
        }

        public async Task<AddressGetByIdDto> Handle(AddressGetByIdQuery request, CancellationToken cancellationToken)
        {
            //var dbQuery = _applicationDbContext.Addresses.AsQueryable();
 
            //var address = dbQuery.FirstOrDefault(x => x.Id == request.Id);

            var address = _applicationDbContext.Addresses.Include(x => x.Country).Include(x => x.City)
                .FirstOrDefault(x => x.Id == request.Id);


            if (address == null)
            {
                throw new InvalidOperationException("The address was not found");

            }

            return new AddressGetByIdDto()
            {
                Name = address.Name,
                UserId = address.UserId,
                CountryId = address.CountryId,
                CountryName = address.Country.Name,
                CityId = address.CityId,
                CityName = address.City.Name,
                District = address.District,
                PostCode = address.PostCode,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                addressType = address.AddressType
            };
        }
    }
}
