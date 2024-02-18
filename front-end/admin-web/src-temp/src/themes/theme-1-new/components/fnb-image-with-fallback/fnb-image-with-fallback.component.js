const ImageWithFallback = ({ src, alt, fallbackSrc, style, className, align }) => {
    return <img align={align} src={Boolean(src) ? src : fallbackSrc} alt={alt} style={style} className={className} />;
};

export default ImageWithFallback;
