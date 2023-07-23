﻿namespace Application.Features.Products.Commands.Queries.GetById
{
    public class ProductGetByIdDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }

        public string Name { get; set; }

        public string Picture { get; set; }

        public bool IsOnSale { get; set; }

        public string Price { get; set; }

        public string? SalePrice { get; set; }
    }
}
