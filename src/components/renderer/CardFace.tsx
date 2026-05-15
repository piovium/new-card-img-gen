import type { JSX } from "solid-js";
import { useGlobalSettings } from "../../context";
import {
  BASE_URL,
  CARD_LEGEND_FRAME,
  CARD_NORMAL_FRAME,
} from "../../constants";
import { cardFaceUrl } from "../../utils";
import "./CardFace.css";
import type { ParsedActionCard, ParsedCharacter } from "../../types";

export const CardFace = (props: {
  class?: string;
  item: ParsedActionCard | ParsedCharacter;
  isLegend?: boolean;
  children?: JSX.Element;
}) => {
  const { cardbackImage } = useGlobalSettings();
  return (
    <div class={`card-face-component ${props.class ?? ""}`}>
      <div class="card-back">
        <img src={`${BASE_URL}assets/cardbacks/${cardbackImage()}.png`} class="card-back-image" />
        <img src={CARD_NORMAL_FRAME} class="card-back-frame" /> 
      </div>
      <div class="card-face">
        <img src={cardFaceUrl(props.item)} class="card-face-image" />
        <img
          src={props.isLegend ? CARD_LEGEND_FRAME : CARD_NORMAL_FRAME}
          class="card-face-frame"
        />
        {props.children}
      </div>
    </div>
  );
};
