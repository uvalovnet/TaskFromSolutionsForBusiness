using Task.BLL.Models;
using Task.DataBase;

namespace Task.BLL.Interfaces
{
    public interface IOrderService
    {
        public List<Joined> GetOrders();
        public List<Joined> GetOrders(DateTime? start, DateTime? end,
            int? providerId, string? orderNumber, string? orderItemName,
            string? orderItemUnit);
        public Order GetOrderDetails(int id);
        public void CreateOrder(Order order, List<OrderItem>? items);
        public void UpdateOrder(Order order, List<OrderItem>? items);
        public void DeleteOrder(int id);
    }
}
