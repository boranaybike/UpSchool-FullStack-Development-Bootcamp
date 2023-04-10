using MediatR;

namespace Application.Features.Addresses.Queries.GetById
{
    public class AddressGetByIdQuery:IRequest<AddressGetByIdDto>
    {
        public int Id { get; set; }

        public AddressGetByIdQuery(int userId, int id)
        {
            Id = id;
        }

    }
}
