using eShopping.Common.AutoWire;
using eShopping.Common.Constants;
using eShopping.Interfaces.Common;

using Microsoft.Extensions.DependencyInjection;

using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace eShopping.Services
{
    [AutoService(typeof(IImageService), Lifetime = ServiceLifetime.Transient)]
    public class ImageService : IImageService
    {
        #region privated methods

        private static ImageCodecInfo GetEncoderInfo(string mimeType)
        {
            // Get image codecs for all image formats
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();

            // Find the correct image codec
            for (int i = 0; i < codecs.Length; i++)
            {
                if (codecs[i].MimeType == mimeType)
                {
                    return codecs[i];
                }
            }

            return null;
        }

        #endregion privated methods

        /// <summary>
        /// Reduce Image source quality
        /// </summary>
        /// <param name="source">Image Source</param>
        /// <param name="contentType">Image Content-type (ex: image/png, image/jpg...)</param>
        /// <param name="quality">Image quality percen compare with soure</param>
        /// <returns></returns>
        public Image ReduceImageQuality(Image source, string contentType, int quality)
        {
            try
            {
                if (quality < 0 || quality > 100)
                {
                    return null;
                }

                Stream ms = new MemoryStream();
                EncoderParameter qualityParam = new EncoderParameter(Encoder.Quality, quality);
                ImageCodecInfo jpegCodec = GetEncoderInfo(contentType);
                EncoderParameters encoderParams = new EncoderParameters(1);
                encoderParams.Param[0] = qualityParam;
                source.Save(ms, jpegCodec, encoderParams);
                return Image.FromStream(ms);
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Resize Image resolution
        /// </summary>
        /// <param name="source">Image source</param>
        /// <param name="maxHeight"> Max height</param>
        /// <param name="maxWidth">Max width</param>
        /// <returns></returns>
        public Image ResizeImage(Image source, int maxHeight, int maxWidth)
        {
            // Calculate the new width and height while maintaining the aspect ratio
            double aspectRatio = (double)source.Width / source.Height;
            int newWidth = maxWidth;
            int newHeight = (int)Math.Round(newWidth / aspectRatio);

            if (newHeight > maxHeight)
            {
                newHeight = maxHeight;
                newWidth = (int)Math.Round(newHeight * aspectRatio);
            }

            if (source.Width <= maxWidth || source.Height <= maxHeight)
            {
                newWidth = source.Width;
                newHeight = source.Height;
            }

            // Create a new Bitmap with the new dimensions
            Bitmap resizedImage = new Bitmap(newWidth, newHeight);

            // Draw the original image onto the resized image with high-quality settings
            using (Graphics graphics = Graphics.FromImage(resizedImage))
            {
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.DrawImage(source, 0, 0, newWidth, newHeight);
            }

            return resizedImage;
        }

        /// <summary>
        /// Check stream file is Image
        /// </summary>
        /// <param name="file">File</param>
        /// <returns></returns>
        public bool IsImageFromStream(Stream file)
        {
            var ms = new MemoryStream();
            file.CopyTo(ms);
            var isImage = false;
            try
            {
                using Image img = Image.FromStream(ms);
                isImage = true;
            }
            catch (Exception)
            {
                return false;
            }
            return isImage;
        }

        public Stream GenerateThumbnail(Image image, string contentType, int imageSize)
        {
            Stream streamResult = new MemoryStream();
            Image imgResize = ResizeImage(image, imageSize, imageSize);
            Image imgReduceQuality = ReduceImageQuality(imgResize, contentType, DefaultConstants.IMAGE_THUMBNAIL_QUALITY);
            imgReduceQuality.Save(streamResult, imgReduceQuality.RawFormat);
            streamResult.Position = 0;
            return streamResult;
        }
    }
}