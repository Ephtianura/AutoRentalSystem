using Amazon.S3;
using Amazon.S3.Transfer;
using AutoRentalSystem.Core.Contracts;

namespace AutoRentalSystem.Infrastructure.FileStorage
{


    public class S3FileStorageService : IFileStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3FileStorageService(IAmazonS3 s3Client, string bucketName)
        {
            _s3Client = s3Client;
            _bucketName = bucketName;
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
        {
            var key = $"{Guid.NewGuid()}_{fileName}";

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                Key = key,
                BucketName = _bucketName,
                CannedACL = S3CannedACL.PublicRead
            };

            var transferUtility = new TransferUtility(_s3Client);
            await transferUtility.UploadAsync(uploadRequest);

            return $"http://localhost:9000/{_bucketName}/{key}";

        }
    }

}
