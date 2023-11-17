using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using TaskFromSolutionsForBusiness.Models;

namespace TaskFromSolutionsForBusiness.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}