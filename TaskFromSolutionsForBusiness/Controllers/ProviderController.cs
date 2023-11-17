using Microsoft.AspNetCore.Mvc;
using Task.BLL.Interfaces;
using Task.BLL.Services;

namespace TaskFromSolutionsForBusiness.Controllers
{
    [ApiController]
    [Route("Providers")]
    public class ProviderController : Controller
    {
        readonly IProviderService providerService;
        public ProviderController(IProviderService service)
        {
            providerService = service;
        }
        [HttpGet("")]
        public IActionResult GetProviders()
        {
            return Json(providerService.GetProviders());
        }
    }
}
