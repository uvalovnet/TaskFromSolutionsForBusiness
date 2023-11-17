using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task.DataBase;

namespace Task.BLL.Models
{
    public class RequestsItems
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public DateTime Date { get; set; }
        public int ProviderId { get; set; }
        public List<OrderItem> listItems {  get; set; }
    }
}
