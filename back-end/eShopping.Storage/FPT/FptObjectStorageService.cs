using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;

using eShopping.Domain.Settings;
using eShopping.Storage.Shared.Models;

using Microsoft.Extensions.Options;

using MimeTypes;

using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Storage.FPT
{
    public class FptObjectStorageService : IFptObjectStorageService, IDisposable
    {
        private const string DEFAULT_BUCKET_NAME = "common";
        private const string DEFAULT_FOLDER = null;

        private readonly IAmazonS3 _awsS3Client;
        private readonly AwsS3Settings _awsS3Settings;

        public FptObjectStorageService(IOptions<AppSettings> appSettingsOpt)
        {
            _awsS3Settings = appSettingsOpt.Value.AwsS3Settings;
            _awsS3Client = CreateAwsS3Client(_awsS3Settings);
        }

        #region privated methods

        private IAmazonS3 CreateAwsS3Client(AwsS3Settings setting)
        {
            try
            {
                var config = new AmazonS3Config();
                config.ServiceURL = setting.Endpoint;
                //config.RegionEndpoint = null;
                config.AllowAutoRedirect = true;
                config.ForcePathStyle = true;
                config.Timeout = TimeSpan.FromMinutes(30);
                return new AmazonS3Client(setting.AccessKey, setting.SecretKey, config);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<string> UploadAsync(Stream file, string fileName, string contentType, string bucketName = DEFAULT_BUCKET_NAME, string folder = DEFAULT_FOLDER, CancellationToken cancellationToken = default)
        {
            try
            {
                bool existsButket = await AmazonS3Util.DoesS3BucketExistV2Async(_awsS3Client, bucketName);
                if (!existsButket)
                {
                    var bucketRequest = new PutBucketRequest()
                    {
                        BucketName = bucketName,
                        UseClientRegion = true,
                    };
                    // Create new bucket
                    await _awsS3Client.PutBucketAsync(bucketRequest);
                }
                var fileNameWithExtension = GetFileNameWithExtension(fileName, contentType);
                var objectRequest = new PutObjectRequest()
                {
                    BucketName = bucketName,
                    Key = BuilFileUrl(_awsS3Settings.Folder, fileNameWithExtension),
                    ContentType = contentType,
                    InputStream = file
                };
                await _awsS3Client.PutObjectAsync(objectRequest, cancellationToken);

                var fileUrl = BuilFileUrl(_awsS3Settings.Endpoint, _awsS3Settings.BucketName, _awsS3Settings.Folder, fileNameWithExtension);
                return fileUrl;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private string BuilFileUrl(params string[] args)
        {
            return string.Join('/', args.Where(s => !string.IsNullOrEmpty(s)));
        }

        private string GetFileNameIfNotExist(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return DateTime.Now.ToString("yyyyMMddhhmmssfff");
            }
            return fileName;
        }

        private string GetFileNameWithExtension(string fileName, string contentType)
        {
            try
            {
                fileName = GetFileNameIfNotExist(fileName);
                var fileExtension = MimeTypeMap.GetExtension(contentType);
                if (fileName.EndsWith(fileExtension))
                {
                    return fileName;
                }
                return fileName + fileExtension;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion privated methods

        public async Task<string> UploadFileAsync(Stream file, string fileName, string contentType, CancellationToken cancellationToken = default)
        {
            var fileUrl = await UploadAsync(file, fileName, contentType, _awsS3Settings.BucketName, _awsS3Settings.Folder, cancellationToken);
            return fileUrl;
        }

        public async Task<string> UploadFileAsync(FileUploadRequestModel request, CancellationToken cancellationToken = default)
        {
            var fileUrl = await UploadAsync(request.File.OpenReadStream(), request.FileName, request.File.ContentType, _awsS3Settings.BucketName, _awsS3Settings.Folder, cancellationToken);
            return fileUrl;
        }

        public void Dispose()
        {
            _awsS3Client?.Dispose();
        }
    }
}