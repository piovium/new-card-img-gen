/// <reference types="vite/client" />

import { RenderAppOption } from "./App";

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      form: (el: HTMLFormElement) => void;
      field: (el: HTMLElement) => void;
    }
  }
}

declare global {
  interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    toBase64(options?: {
      alphabet?: "base64" | "base64url";
      omitPadding?: boolean;
    }): string;
  }
  interface Window {
    renderCardImage: (data: RenderAppOption) => Promise<string>;
  }
}

declare module "@gi-tcg/assets-manager" {
  interface CharacterRawData {
    cardFaceUrl?: string;
    iconUrl?: string;
  }

  interface SkillRawData {
    iconUrl?: string;
  }

  interface EntityRawData {
    cardFaceUrl?: string;
    buffIconUrl?: string;
  }

  interface ActionCardRawData {
    cardFaceUrl?: string;
  }
}

declare module "csstype" {
  interface StandardPropertiesHyphen {
    "anchor-name"?: string;
    "position-anchor"?: string;
  }
}

export {};
