﻿using Domain.Common;
using Domain.Enums;
using MediatR;

namespace Application.Features.Addresses.Commands.Add
{
    public class AddressAddCommand:IRequest<Response<int>>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public int CountryId { get; set; }
        public int CityId { get; set; }
        public string District { get; set; }
        public string PostCode { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public AddressType AddressType { get; set; }
    }
}
