using Application.Features.Addresses.Commands.Add;
using Application.Features.Addresses.Commands.Delete;
using Application.Features.Addresses.Commands.HardDelete;
using Application.Features.Addresses.Commands.Update;
using Application.Features.Addresses.Queries.GetAll;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ApiControllerBase
    {
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(AddressDeleteCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
        
        [HttpDelete("HardDelete")]
        public async Task<IActionResult> HardDeleteAsync(AddressHardDeleteCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddAsync(AddressAddCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("Update")]
        public async Task<IActionResult> AddAsync(AddressUpdateCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            return Ok(await Mediator.Send(new AddressGetAllQuery(id, null)));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync(AddressGetAllQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
