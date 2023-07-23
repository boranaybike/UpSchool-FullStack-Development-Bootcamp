using Domain.Common;
using MediatR;

namespace Application.Features.Products.Commands.Add
{
    public class ProductAddCommand : IRequest<Response<Guid>>
    {
        public Guid OrderId { get; set; }

        public string Name { get; set; }

        public string Picture { get; set; }

        public bool IsOnSale { get; set; }

        public string Price { get; set; }

        public string? SalePrice { get; set; }
    }
}
