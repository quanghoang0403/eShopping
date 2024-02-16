using eShopping.Storage.Shared.Models;

using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Storage.FPT
{
    public interface IFptObjectStorageService
    {
        Task<string> UploadFileAsync(Stream file, string fileName, string contentType, CancellationToken cancellationToken = default);

        Task<string> UploadFileAsync(FileUploadRequestModel request, CancellationToken cancellationToken = default);
    }
}