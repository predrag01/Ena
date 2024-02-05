using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IPlayerService
    {
        Task<Player> CreatePlayer(int userId, int gameId, bool host=false);
    }
}
