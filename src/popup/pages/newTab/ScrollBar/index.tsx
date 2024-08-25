import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";

import "./Index.less";

interface ScrollBarComponentProps {
  style?: React.CSSProperties;
  /**
   * 容器高度，默认400px
   */
  height?: string;
  /**
   * 子节点
   */
  children: React.ReactNode;
}

const ScrollBarComponent: React.FC<ScrollBarComponentProps> = forwardRef(
  ({ children, style, ...props }, scrollRef) => {
    // const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0); // 滚动状态的位置
    // 组件挂载后，如果需要可以设置初始滚动位置

    // 使用useEffect来处理组件更新后的滚动位置
    // useEffect(() => {
    //   setScrollPosition(scrollRef.current?.scrollTop ?? 0);
    // }, [scrollRef]);
    const handleScroll = useCallback(() => {
      setScrollPosition(scrollRef?.current?.scrollTop ?? 0);
    }, [scrollRef]);

    return (
      // onScroll={handleScroll}

      <div
        ref={scrollRef}
        className="scroll-bar"
        onScroll={handleScroll}
        style={{
          ...props.style,
          height: props.height ? props.height : "400px", // 容器高度，根据需要调整
          overflowY: "auto", // 允许垂直滚动
        }}
        {...props} // 传递其他props
      >
        {children}
      </div>
    );
  }
);

// export default ScrollBarComponent;
export default React.forwardRef<HTMLDivElement, ScrollBarComponentProps>(
  (props, ref) => {
    return <ScrollBarComponent ref={ref} {...props} />;
  }
);
