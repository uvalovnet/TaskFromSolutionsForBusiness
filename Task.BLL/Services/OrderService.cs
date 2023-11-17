using Task.BLL.Interfaces;
using Task.BLL.Models;
using Task.DataBase;

namespace Task.BLL.Services
{
    public class OrderService : IOrderService
    {
        private OrderContext _context;
        private IOrderItemService _itemService;
        public OrderService(OrderContext context, IOrderItemService itemService)
        {
            _context = context;
            _itemService = itemService;
        }
        public void CreateOrder(Order order, List<OrderItem> items)
        {
            if (_context.Orders.Where(x => x.Number == order.Number && x.ProviderId == order.ProviderId).ToList().Count != 0)
            { return; }
            _context.Orders.Add(order);
            _context.SaveChanges();
            if (items.Count > 0) {
                foreach (var item in items)
                {
                    item.OrderId = _context.Orders.Max(x => x.Id);
                    _itemService.CreateItem(new OrderItem() { OrderId = item.OrderId, Name = item.Name, Quantity = item.Quantity, Unit = item.Unit });
                    _context.SaveChanges();
                }
            }
        }

        public void DeleteOrder(int id)
        {
            var order = _context.Orders.Where(x => x.Id == id).FirstOrDefault();
            if (order != null)
            {
                _context.Orders.Remove(order);
                var orderItems = _context.OrderItems.Where(x => x.OrderId == id).ToList();
                if (orderItems.Count > 0)
                    foreach (var item in orderItems)
                        _context.OrderItems.Remove(item);
                _context.SaveChanges();
            }
        }

        public Order GetOrderDetails(int id)
        {
            return _context.Orders.Where(x => x.Id == id).FirstOrDefault();
        }

        public List<Joined> GetOrders()
        {
            var joinedTable = _context.Orders.Join(_context.Providers,
                p => p.ProviderId,
                c => c.Id,
                (p, c) => new Joined
                {
                    Id = p.Id,
                    Number = p.Number,
                    Date = p.Date,
                    Provider = c.Name
                });

            return joinedTable.ToList();
        }

        public List<Joined> GetOrders(DateTime? start, DateTime? end,
            int? providerId, string? orderNumber, string? orderItemName,
            string? orderItemUnit)
        {
            IQueryable<Order> filtered = _context.Orders;

            if(start != null) { filtered = filtered.Where(x => x.Date > start); }

            if (end != null) { filtered = filtered.Where(x => x.Date < end); }

            if (providerId != null) { filtered = filtered.Where(x => x.ProviderId == providerId); }

            if (orderNumber != null) { filtered = filtered.Where(x => x.Number == orderNumber); }

            if (orderItemName != null) 
            { filtered = filtered.Where(x => x.Id == _context.OrderItems.First(y => y.Name == orderItemName).OrderId); }

            if (orderItemUnit != null)
            { filtered = filtered.Where(x => x.Id == _context.OrderItems.First(y => y.Unit == orderItemUnit).OrderId); }
            
            var joinedTable = filtered.ToList().Join(_context.Providers,
                p => p.ProviderId,
                c => c.Id,
                (p, c) => new Joined
                {
                    Id = p.Id,
                    Number = p.Number,
                    Date = p.Date,
                    Provider = c.Name
                });

            return joinedTable.ToList();

        }  
        public void UpdateOrder(Order order, List<OrderItem> items)
        {
            if (_context.Orders.Where(x => x.Number == order.Number && x.ProviderId == order.ProviderId && x.Id != order.Id).ToList().Count != 0)
            { return; }
            var orderNew = _context.Orders.FirstOrDefault(x=>x.Id == order.Id);
            orderNew = order;
            _context.SaveChanges();
            if (items.Count > 0)
            {
                foreach (var item in items)
                {
                    if(item.Id == -1)
                    {
                        _itemService.CreateItem(item);
                    }
                    else
                    {
                        _itemService.UpdateItem(item);
                    }
                }
            }
        }
    }
}
