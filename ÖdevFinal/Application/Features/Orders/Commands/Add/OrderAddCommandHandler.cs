﻿using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.Features.Orders.Commands.Add
{
    public class OrderAddCommandHandler : IRequestHandler<OrderAddCommand, Response<int>>
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public OrderAddCommandHandler(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        public async Task<Response<int>> Handle(OrderAddCommand request, CancellationToken cancellationToken)
        {
            var order = new Order
            {
                Id = request.Id,
                RequestedAmount = request.RequestedAmount,
                TotalFoundAmount = request.TotalFoundAmount,
                ProductCrawlType = request.ProductCrawlType,
                OrderEvents = request.OrderEvents,
                CreatedOn = new DateTimeOffset(DateTime.UtcNow),
            };

            await _applicationDbContext.Orders.AddAsync(order, cancellationToken);

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return new Response<int>($"The searched order was successfully added.");
        }
    }
}
