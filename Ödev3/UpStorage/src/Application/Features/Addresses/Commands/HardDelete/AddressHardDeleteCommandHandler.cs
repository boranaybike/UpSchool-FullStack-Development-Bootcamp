using Application.Common.Interfaces;
using Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Addresses.Commands.HardDelete
{
    public class AddressHardDeleteCommandHandler : IRequestHandler<AddressHardDeleteCommand, Response<int>>
    {
        readonly private IApplicationDbContext _applicationDbContext;

        public AddressHardDeleteCommandHandler(IApplicationDbContext context)
        {
            _applicationDbContext = context;
        }
        public async Task<Response<int>> Handle(AddressHardDeleteCommand request, CancellationToken cancellationToken)
        {

            var address = await _applicationDbContext.Addresses.Where(x => x.Id == request.Id).FirstOrDefaultAsync();

            if (address == null)
            {
                throw new ArgumentException();
            }

            _applicationDbContext.Addresses.Remove(address);
            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return new Response<int>($"successfully deleted.", address.Id);
        }
    }
}
