using eShopping.Storage.Models;
using System.IO;
using System.Threading.Tasks;

namespace eShopping.Storage.Azure
{
    public interface IAzureStorageService
    {
        Task<string> UploadFileToStorageAsync(Stream fileStream, string fileName);

        Task<string> UploadFileToStorageAsync(Stream fileStream, string fileName, string contentType);

        Task<string> UploadFileToStorageAsync(FileUploadRequestModel request);

        Task<string> UploadFileToStorageStoreWebAsync(FileUploadRequestModel request);
    }
}