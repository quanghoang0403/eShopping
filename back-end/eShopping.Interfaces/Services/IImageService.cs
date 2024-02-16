using System.Drawing;
using System.IO;

namespace eShopping.Interfaces.Common
{
    public interface IImageService
    {
        bool IsImageFromStream(Stream file);

        Image ResizeImage(Image source, int maxHeight, int maxWidth);

        Image ReduceImageQuality(Image source, string contentType, int quality);

        Stream GenerateThumbnail(Image image, string contentType, int imageSize);
    }
}