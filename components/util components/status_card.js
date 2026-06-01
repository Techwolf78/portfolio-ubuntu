import React, { Component } from 'react';
import SmallArrow from './small_arrow';
import onClickOutside from 'react-onclickoutside';

class Slider extends Component {
	render() {
		return (
			<input
				type="range"
				onChange={this.props.onChange}
				className={this.props.className}
				name={this.props.name}
				min="0"
				max="100"
				value={this.props.value}
				step="1"
			/>
		);
	}
}

export class StatusCard extends Component {
	constructor() {
		super();
		this.wrapperRef = React.createRef();
	}
	handleClickOutside = () => {
		this.props.toggleVisible();
	};
	componentDidMount() {
		// State is handled globally in ubuntu.js
	}

	handleBrightness = (e) => {
		this.props.changeBrightness(e.target.value);
	};

	handleSound = (e) => {
		this.props.changeVolume(e.target.value);
	};

	render() {
		return (
			<div
				ref={this.wrapperRef}
				className={
					'absolute bg-ub-cool-grey rounded-md py-4 top-9 right-3 shadow border-black border border-opacity-20 status-card z-50' +
					(this.props.visible ? ' visible animateShow' : ' invisible')
				}
			>
				{' '}
				{/* Status Card */}
				<div className="absolute w-0 h-0 -top-1 right-6 top-arrow-up" />
				<div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/audio-headphones-symbolic.svg" alt="ubuntu headphone" className={this.props.muteSound ? "opacity-30" : ""} />
					</div>
					<Slider
						onChange={this.handleSound}
						className="ubuntu-slider w-2/3"
						value={this.props.volume}
						name="headphone_range"
					/>
				</div>
				<div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/display-brightness-symbolic.svg" alt="ubuntu brightness" />
					</div>
					<Slider
						onChange={this.handleBrightness}
						className="ubuntu-slider w-2/3"
						name="brightness_range"
						value={this.props.brightness}
					/>
				</div>
				<div className="w-64 flex content-center justify-center">
					<div className="w-2/4 border-black border-opacity-50 border-b my-2 border-solid" />
				</div>
				<div 
					onClick={this.props.toggleWifi}
					className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 cursor-pointer"
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/network-wireless-signal-good-symbolic.svg" alt="ubuntu wifi" className={this.props.wifi ? "" : "opacity-30"} />
					</div>
					<div className={"w-2/3 flex items-center justify-between " + (this.props.wifi ? "text-white" : "text-gray-400")}>
						<span>{this.props.wifi ? "OnePlus 8 Pro" : "Disconnected"}</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/bluetooth-symbolic.svg" alt="ubuntu bluetooth" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-gray-400">
						<span>Off</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/battery-good-symbolic.svg" alt="ubuntu battery" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-gray-400">
						<span>2:40 Remaining (75%)</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="w-64 flex content-center justify-center">
					<div className="w-2/4 border-black border-opacity-50 border-b my-2 border-solid" />
				</div>
				<div
					onClick={this.props.toggleMuteSound}
					className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 cursor-pointer"
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/audio-headphones-symbolic.svg" alt="ubuntu sound status" className={this.props.muteSound ? "opacity-30" : ""} />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Startup Sound: {this.props.muteSound ? "Muted" : "On"}</span>
					</div>
				</div>
				<div
					id="open-settings"
					className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 cursor-pointer"
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/emblem-system-symbolic.svg" alt="ubuntu settings" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Settings</span>
					</div>
				</div>
				<div
					onClick={this.props.lockScreen}
					className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 cursor-pointer"
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="ubuntu lock" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Lock</span>
					</div>
				</div>
				<div
					onClick={this.props.shutDown}
					className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20 cursor-pointer"
				>
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/system-shutdown-symbolic.svg" alt="ubuntu power" />
					</div>
					<div className="w-2/3 flex items-center justify-between">
						<span>Power Off / Log Out</span>
						<SmallArrow angle="right" />
					</div>
				</div>
			</div>
		);
	}
}

export default onClickOutside(StatusCard);
