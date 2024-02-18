const ImageWithFallback = ({ src, alt, fallbackSrc, style, className }) => {
  const srcImg = Boolean(src) ? src : fallbackSrc;
  return <img src={srcImg} alt={alt} style={style} className={className} />;
};

export default ImageWithFallback;
