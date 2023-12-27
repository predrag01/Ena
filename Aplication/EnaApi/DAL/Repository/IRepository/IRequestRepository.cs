using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IRequestRepository : IRepository<Request>
    {
        Task<Request> GetRequestBySenderAndRecipient(int SenderId, int RecipientId);
        Task<Request> GetRequestById(int RequestId);
    }
}
