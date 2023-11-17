using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using Task.BLL.Interfaces;
using Task.BLL.Models;
using Task.DataBase;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TaskFromSolutionsForBusiness.Controllers
{
    [ApiController]
    [Route("Orders")]
    public class OrderController : Controller
    {
        readonly IOrderService orderService;
        public OrderController(IOrderService service)
        {
            orderService = service; 
        }

        [HttpGet("")]
        public IActionResult GetOrders()
        {
            return Json(orderService.GetOrders());
        }

        [HttpGet("Filtered")]
        public IActionResult GetOrders(DateTime? start, DateTime? end,
            int? providerId, string? orderNumber, string? orderItemName,
            string? orderItemUnit)
        {
            if(start == null) { start = DateTime.Now.AddDays(-30d); }
            if(end == null) { end = DateTime.Now; }
            return Json(orderService.GetOrders(start, end, providerId, orderNumber, orderItemName, orderItemUnit));
        }

        [HttpGet("{id}")]
        public IActionResult GetOrderDetails(int id)
        {
            return Json(orderService.GetOrderDetails(id));
        }

        [HttpPost("Create")]
        public IActionResult CreateOrder(RequestsItems items)
        {
            try
            {
                var date = DateTime.Now;
                List<OrderItem> itemsList = null;
                if (items.listItems != null) { itemsList = new List<OrderItem>(items.listItems); }
                orderService.CreateOrder(new Order() { Number = items.Number, Date = date, ProviderId = items.ProviderId }, itemsList);

                return StatusCode(200);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut("Update")]
        public IActionResult UpdateOrder(RequestsItems items)
        {
           try
           {
                List<OrderItem> itemsList = null;
                if (items.listItems != null) { itemsList = new List<OrderItem>(items.listItems); }
                orderService.CreateOrder(new Order() { Id = items.Id, Number = items.Number, Date = items.Date, ProviderId = items.ProviderId }, itemsList);

                return StatusCode(200);
           }
           catch
           {
                return StatusCode(500);
           }
        }

        [HttpDelete("Delete/{id}")]
        public void DeleteOrder(int id)
        {
            Console.WriteLine(id);
            orderService.DeleteOrder(id);
        }
    }
}


