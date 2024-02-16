using Microsoft.AspNetCore.Http;
using eShopping.Storage.Shared.Constants;

namespace eShopping.Storage.Shared.Models
{
    public class FileUploadRequestModel
    {
        public FileUploadRequestModel()
        {
            FileSizeLimit = DefaultConstants.STORE_IMAGE_LIMIT;
        }

        public IFormFile File { get; set; }

        public string FileName { get; set; }

        public int FileSizeLimit { get; set; } = DefaultConstants.STORE_IMAGE_LIMIT;
    }
}