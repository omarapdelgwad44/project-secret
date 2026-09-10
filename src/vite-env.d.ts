/// <reference types="vite/client" />

declare module "react-pageflip" {
  import { Component, ReactNode, CSSProperties } from "react";

  export interface IEventProps {
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: string }) => void;
    onChangeState?: (e: { data: string }) => void;
    onInit?: (e: { data: { page: number; mode: string } }) => void;
    onUpdate?: (e: { data: { page: number; mode: string } }) => void;
  }

  export interface IFlipSetting {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    startPage?: number;
  }

  export interface IProps extends IFlipSetting, IEventProps {
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
    renderOnlyPageLengthChange?: boolean;
  }

  export interface FlipBookApi {
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    destroy(): void;
  }

  export default class HTMLFlipBook extends Component<IProps> {
    pageFlip(): FlipBookApi;
  }
}
