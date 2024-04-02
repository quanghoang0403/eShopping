using Microsoft.AspNetCore.Http;

namespace eShopping.Storage.Models
{
    public class FileUploadRequestModel
    {
        public FileUploadRequestModel()
        {
        }

        public IFormFile File { get; set; }

        public string FileName { get; set; }

        public int FileSizeLimit { get; set; }
    }
}