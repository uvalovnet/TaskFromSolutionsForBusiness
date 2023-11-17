using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Task.BLL.Interfaces;
using Task.DataBase;

namespace Task.BLL.Services
{
    public class OrderItemService : IOrderItemService
    {
        private OrderContext _context;

        public OrderItemService(OrderContext context)
        {
            _context = context;
        }
        public void CreateItem(OrderItem item)
        {
            if (item.Name == _context.Orders.FirstOrDefault(x => x.Id == item.OrderId).Number) { return; }
            _context.OrderItems.Add(item);
            _context.SaveChanges();
        }

        public void DeleteItem(int id)
        {
            var item =_context.OrderItems.Where(x => x.Id == id).FirstOrDefault();
            if (item != null)
            {
                _context.OrderItems.Remove(item);
                _context.SaveChanges();
            }
        }

        public OrderItem GetItem(int id)
        {
            return _context.OrderItems.FirstOrDefault(x => x.Id == id);
        }

        public List<OrderItem> GetItems(int orderId)
        {
            return _context.OrderItems.Where(x => x.OrderId == orderId).ToList();
        }

        public void UpdateItem(OrderItem item)
        {
            if (item.Name == _context.Orders.FirstOrDefault(x => x.Id == item.OrderId).Number) { return; }
            var row = _context.OrderItems.First(x => x.Id == item.Id);
            row = item;
            _context.SaveChanges();
        }
    }
}
