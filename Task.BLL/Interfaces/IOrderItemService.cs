using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task.DataBase;

namespace Task.BLL.Interfaces
{
    public interface IOrderItemService
    {
        public List<OrderItem> GetItems(int orderId);
        public OrderItem GetItem(int id);
        public void CreateItem(OrderItem item);
        public void UpdateItem(OrderItem item);
        public void DeleteItem(int id);
    }
}
