using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
using Task.BLL.Interfaces;
using Task.DataBase;

namespace TaskFromSolutionsForBusiness.Controllers
{
    [ApiController]
    [Route("OrderItems")]
    public class OrderItemController : Controller
    {
        readonly IOrderItemService orderService;
        public OrderItemController(IOrderItemService service)
        {
            orderService = service;
        }

        [HttpGet("{orderId}")]
        public IActionResult GetItems(int orderId)
        {
            var items = orderService.GetItems(orderId);
            if (items != null)
            {
                return Json(items);
            }
            return StatusCode(404);
        }

        [HttpPost("Create")]
        public IActionResult CreateItem(int orderId, string name, decimal quantity, string unit)
        {
            try
            {
                orderService.CreateItem(new Task.DataBase.OrderItem()
                {
                    OrderId = orderId,
                    Name = name,
                    Quantity = quantity,
                    Unit = unit
                });
                return StatusCode(200);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut("Update")]
        public IActionResult UpdateItem(int id, int orderId, string name, decimal quantity, string unit)
        {
            try 
            { 
                orderService.UpdateItem(
                    new Task.DataBase.OrderItem() {
                    Id = id, OrderId = orderId, Name = name, Quantity = quantity, Unit = unit });
                    return StatusCode(200);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteItem(int id)
        {
            
            try
            {
                orderService.DeleteItem(id);
                return StatusCode(200);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}
