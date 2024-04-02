using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using eShopping.Domain.Settings;
using eShopping.Storage.Models;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading.Tasks;

namespace eShopping.Storage.Azure
{
    public class AzureStorageService : IAzureStorageService
    {
        private readonly AppSettings _appSettings;
        private readonly AzureStorageSettings _azureStorageSettings;

        public AzureStorageService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _azureStorageSettings = _appSettings.AzureStorageSettings;
        }

        public async Task<string> UploadFileToStorageAsync(Stream fileStream, string fileName)
        {
            // Create a URI to the blob
            string url = $"{_azureStorageSettings.BlobUri}/{fileName}";
            Uri blobUri = new(url);

            // Create StorageSharedKeyCredentials object by reading
            StorageSharedKeyCredential storageCredentials = new(_azureStorageSettings.AccountName, _azureStorageSettings.AccountKey);

            // Create the blob client.
            BlobClient blobClient = new(blobUri, storageCredentials);

            // Upload the file
            await blobClient.UploadAsync(fileStream);

            return await Task.FromResult(url);
        }

        public async Task<string> UploadFileToStorageAsync(FileUploadRequestModel request)
        {
            if (request.File.Length > request.FileSizeLimit)
            {
                throw new Exception("File size is too big.");
            }

            // Create a URI to the blob
            var fileExtension = Path.GetExtension(request.File.FileName);
            string url = $"{_azureStorageSettings.BlobUri}/{request.FileName}{fileExtension}";
            Uri blobUri = new(url);

            // Create StorageSharedKeyCredentials object by reading
            StorageSharedKeyCredential storageCredentials = new(_azureStorageSettings.AccountName, _azureStorageSettings.AccountKey);

            // Create the blob client.
            BlobClient blobClient = new(blobUri, storageCredentials);

            // Upload the file
            using Stream fileStream = request.File.OpenReadStream();
            BlobUploadOptions blobUploadOptions = new()
            {
                HttpHeaders = new() { ContentType = request.File.ContentType }
            };

            await blobClient.UploadAsync(fileStream, blobUploadOptions);

            return url;
        }

        public async Task<string> UploadFileToStorageAsync(Stream fileStream, string fileName, string contentType)
        {
            Uri blobUri = new($"{_azureStorageSettings.BlobUri}/{fileName}");
            StorageSharedKeyCredential storageCredentials = new(_azureStorageSettings.AccountName, _azureStorageSettings.AccountKey);
            BlobClient blobClient = new(blobUri, storageCredentials);
            BlobUploadOptions blobUploadOptions = new()
            {
                HttpHeaders = new() { ContentType = contentType }
            };
            await blobClient.UploadAsync(fileStream, blobUploadOptions);
            return blobUri.ToString();
        }

        public async Task<string> UploadFileToStorageStoreWebAsync(FileUploadRequestModel request)
        {
            if (request.File.Length > request.FileSizeLimit)
            {
                throw new Exception("File size is too big.");
            }

            // Create a URI to the blob
            var fileExtension = Path.GetExtension(request.File.FileName);
            string url = $"{_azureStorageSettings.BlobUri}/{request.FileName}{fileExtension}";
            Uri blobUri = new(url);

            // Create StorageSharedKeyCredentials object by reading
            StorageSharedKeyCredential storageCredentials = new(_azureStorageSettings.AccountName, _azureStorageSettings.AccountKey);

            // Create the blob client.
            BlobClient blobClient = new(blobUri, storageCredentials);

            // Upload the file
            using Stream fileStream = request.File.OpenReadStream();
            await blobClient.UploadAsync(fileStream);

            return await Task.FromResult(url);
        }
    }
}