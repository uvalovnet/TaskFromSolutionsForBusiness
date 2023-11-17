using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task.BLL.Interfaces;
using Task.DataBase;

namespace Task.BLL.Services
{
    public class ProviderService : IProviderService
    {
        private OrderContext _context;
        public ProviderService(OrderContext context)
        {
            _context = context;
        }
        public List<Provider> GetProviders()
        {
            return _context.Providers.ToList();
        }
    }
}
