import React, { Component } from 'react';
import BootingScreen from './screen/booting_screen';
import Desktop from './screen/desktop';
import LockScreen from './screen/lock_screen';
import Navbar from './screen/navbar';
import ReactGA from 'react-ga4';

export default class Ubuntu extends Component {
	constructor() {
		super();
		this.state = {
			screen_locked: false,
			bg_image_name: 'wall-9',
			booting_screen: true,
			shutDownScreen: false,
			volume: 80,
			brightness: 100,
			wifi: true,
			matrixRain: false,
			muteSound: false
		};
	}

	componentDidMount() {
		this.getLocalData();
	}

	playStartupSound = () => {
		if (this.state.muteSound) return;
		const audio = new Audio('./audio/startup.mp3');
		audio.volume = this.state.volume / 100;
		audio.play().catch(err => console.log("Autoplay blocked:", err));
	}

	changeVolume = (val) => {
		this.setState({ volume: val });
	}

	changeBrightness = (val) => {
		this.setState({ brightness: val });
	}

	toggleWifi = () => {
		this.setState({ wifi: !this.state.wifi });
	}

	toggleMatrixRain = () => {
		this.setState({ matrixRain: !this.state.matrixRain });
	}

	toggleMuteSound = () => {
		this.setState({ muteSound: !this.state.muteSound });
	}

	setTimeOutBootScreen = () => {
		setTimeout(() => {
			this.setState({ booting_screen: false });
			this.playStartupSound();
		}, 2000);
	};

	getLocalData = () => {
		// Get Previously selected Background Image
		let bg_image_name = localStorage.getItem('bg-image');
		if (bg_image_name !== null && bg_image_name !== undefined) {
			this.setState({ bg_image_name });
		}

		let booting_screen = localStorage.getItem('booting_screen');
		if (booting_screen !== null && booting_screen !== undefined) {
			// user has visited site before
			this.setState({ booting_screen: false });
		} else {
			// user is visiting site for the first time
			localStorage.setItem('booting_screen', false);
			this.setTimeOutBootScreen();
		}

		// get shutdown state
		let shut_down = localStorage.getItem('shut-down');
		if (shut_down !== null && shut_down !== undefined && shut_down === 'true') this.shutDown();
		else {
			// Get previous lock screen state
			let screen_locked = localStorage.getItem('screen-locked');
			if (screen_locked !== null && screen_locked !== undefined) {
				this.setState({ screen_locked: screen_locked === 'true' ? true : false });
			}
		}
	};

	lockScreen = () => {
		// google analytics
		ReactGA.send({ hitType: "pageview", page: "/lock-screen", title: "Lock Screen" });
		ReactGA.event({
			category: `Screen Change`,
			action: `Set Screen to Locked`
		});

		document.getElementById('status-bar').blur();
		setTimeout(() => {
			this.setState({ screen_locked: true });
		}, 100); // waiting for all windows to close (transition-duration)
		localStorage.setItem('screen-locked', true);
	};

	unLockScreen = () => {
		ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

		window.removeEventListener('click', this.unLockScreen);
		window.removeEventListener('keypress', this.unLockScreen);

		this.setState({ screen_locked: false });
		localStorage.setItem('screen-locked', false);
	};

	changeBackgroundImage = (img_name) => {
		this.setState({ bg_image_name: img_name });
		localStorage.setItem('bg-image', img_name);
	};

	shutDown = () => {
		ReactGA.send({ hitType: "pageview", page: "/switch-off", title: "Custom Title" });

		ReactGA.event({
			category: `Screen Change`,
			action: `Switched off the Ubuntu`
		});

		document.getElementById('status-bar').blur();
		this.setState({ shutDownScreen: true });
		localStorage.setItem('shut-down', true);
	};

	turnOn = () => {
		ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

		this.setState({ shutDownScreen: false, booting_screen: true });
		this.setTimeOutBootScreen();
		localStorage.setItem('shut-down', false);
	};

	render() {
		return (
			<div className="w-screen h-screen overflow-hidden relative" id="monitor-screen">
				{/* Brightness filter overlay */}
				<div 
					className="pointer-events-none absolute top-0 left-0 w-full h-full z-[100] bg-black" 
					style={{ opacity: `${(100 - this.state.brightness) * 0.007}` }} 
				/>
				<LockScreen
					isLocked={this.state.screen_locked}
					bgImgName={this.state.bg_image_name}
					unLockScreen={this.unLockScreen}
				/>
				<BootingScreen
					visible={this.state.booting_screen}
					isShutDown={this.state.shutDownScreen}
					turnOn={this.turnOn}
				/>
				<Navbar 
					lockScreen={this.lockScreen} 
					shutDown={this.shutDown}
					volume={this.state.volume}
					brightness={this.state.brightness}
					wifi={this.state.wifi}
					muteSound={this.state.muteSound}
					changeVolume={this.changeVolume}
					changeBrightness={this.changeBrightness}
					toggleWifi={this.toggleWifi}
					toggleMuteSound={this.toggleMuteSound}
				/>
				<Desktop 
					bg_image_name={this.state.bg_image_name} 
					changeBackgroundImage={this.changeBackgroundImage} 
					wifi={this.state.wifi}
					matrixRain={this.state.matrixRain}
					toggleMatrixRain={this.toggleMatrixRain}
				/>
			</div>
		);
	}
}
