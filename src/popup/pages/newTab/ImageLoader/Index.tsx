import React, { useState, useEffect } from "react";

import "./Index.less";

interface ImageProps {
  src: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}
const ImageComponent: React.FC<ImageProps> = (props) => {
  // 状态，用于追踪图片是否加载失败
  const { src, style = {} } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  // 效果钩子，用于处理图片加载失败的情况
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(false);
  }, [src]);

  // 根据图片是否加载成功来设置样式
  const containerStyle = isLoaded ? style : { ...style, backgroundColor: "#eee" };

  return (
    <div className="image-container" style={containerStyle}>
      {Boolean(isLoaded) && (
        <img
          src={src}
          alt={src}
          className="image-component__img"
          onError={() => setIsLoaded(false)}
        />
      )}
    </div>
  );
};

export default ImageComponent;
