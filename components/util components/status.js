import React from "react";
import SmallArrow from "./small_arrow";

export default function Status(props) {
  return (
    <div className="flex justify-center items-center">
      <span className="mx-1.5">
        <img
          width="16px" height="16px"
          src="./themes/Yaru/status/network-wireless-signal-good-symbolic.svg"
          alt="ubuntu wifi"
          className={"inline status-symbol w-4 h-4 " + (props.wifi ? "opacity-100" : "opacity-30")}
        />
      </span>
      <span className="mx-1.5">
        <img
          width="16px" height="16px"
          src="./themes/Yaru/status/audio-volume-medium-symbolic.svg"
          alt="ubuntu sound"
          className={"inline status-symbol w-4 h-4 " + ((props.volume > 0 && !props.muteSound) ? "opacity-100" : "opacity-30")}
        />
      </span>
      <span className="mx-1.5">
        <img
          width="16px" height="16px"
          src="./themes/Yaru/status/battery-good-symbolic.svg"
          alt="ubuntu battry"
          className="inline status-symbol w-4 h-4"
        />
      </span>
      <span className="mx-1">
        <SmallArrow angle="down" className=" status-symbol" />
      </span>
    </div>
  );
}
