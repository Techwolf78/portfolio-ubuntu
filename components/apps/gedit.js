import React, { Component } from 'react';
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Gedit extends Component {

    constructor() {
        super();
        this.state = {
            sending: false,
        }
    }

    sendMessage = async () => {
        let name = $("#sender-name").val().trim();
        let subject = $("#sender-subject").val().trim();
        let message = $("#sender-message").val().trim();

        let error = false;

        if (name.length === 0) {
            $("#sender-name").val('');
            $("#sender-name").attr("placeholder", "Name must not be Empty!");
            error = true;
        }

        if (message.length === 0) {
            $("#sender-message").val('');
            $("#sender-message").attr("placeholder", "Message must not be Empty!");
            error = true;
        }
        if (error) return;

        this.setState({ sending: true });

        try {
            const response = await fetch("https://formsubmit.co/ajax/ajaypawargryphon@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    _subject: subject || "New Portfolio Contact Message",
                    message: message,
                    _captcha: "false" // Disable captcha for smooth portfolio experience
                })
            });

            if (response.ok) {
                this.setState({ sending: false });
                $("#close-gedit").trigger("click");
            } else {
                this.setState({ sending: false });
                alert("Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error("FormSubmit Error:", err);
            this.setState({ sending: false });
            alert("An error occurred. Please try again.");
        }

        ReactGA.event({
            category: "Send Message",
            action: `${name}, ${subject}, ${message}`
        });

    }

    render() {
        return (
            <div className="w-full h-full relative flex flex-col text-white select-none" style={{ backgroundColor: '#333333' }}>
                <div className="flex items-center justify-between w-full border-b border-t border-blue-400 text-sm" style={{ backgroundColor: 'rgba(0, 59, 112, 0.6)' }}>
                    <span className="font-bold ml-2">Send a Message to Me</span>
                    <div className="flex">
                        <div onClick={this.sendMessage} className="border border-black bg-black bg-opacity-50 px-3 py-0.5 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer">Send</div>
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col font-normal windowMainScreen" style={{ backgroundColor: '#021B33' }}>
                    <div className="absolute left-0 top-0 h-full px-2" style={{ backgroundColor: '#010D1A' }}></div>
                    
                    <div className="relative">
                        <input 
                            id="sender-name" 
                            className="w-full focus:bg-ub-gedit-light outline-none font-medium text-sm pl-6 py-0.5 bg-transparent" 
                            placeholder="Your Email / Name :" 
                            spellCheck="false" 
                            autoComplete="off" 
                            type="text" 
                            style={{ color: '#F39A21', backgroundColor: 'transparent' }}
                        />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 font-bold light text-sm" style={{ color: '#50B6C6' }}>1</span>
                    </div>
                    
                    <div className="relative">
                        <input 
                            id="sender-subject" 
                            className="w-full my-1 focus:bg-ub-gedit-light gedit-subject outline-none text-sm font-normal pl-6 py-0.5 bg-transparent" 
                            placeholder="subject (may be a feedback for this website!)" 
                            spellCheck="false" 
                            autoComplete="off" 
                            type="text" 
                            style={{ color: '#50B6C6', backgroundColor: 'transparent' }}
                        />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 font-bold text-sm" style={{ color: '#50B6C6' }}>2</span>
                    </div>
                    
                    <div className="relative flex-grow">
                        <textarea 
                            id="sender-message" 
                            className="w-full gedit-message font-light text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-6 py-1 bg-transparent" 
                            placeholder="Message" 
                            spellCheck="false" 
                            autoComplete="none" 
                            type="text" 
                            style={{ color: '#ffffff', backgroundColor: 'transparent' }}
                        />
                        <span className="absolute left-1 top-1 font-bold text-sm" style={{ color: '#50B6C6' }}>3</span>
                    </div>
                </div>
                {
                    (this.state.sending
                        ?
                        <div className="flex justify-center items-center animate-pulse h-full w-full bg-gray-400 bg-opacity-30 absolute top-0 left-0">
                            <img className={" w-8 absolute animate-spin"} src="./themes/Yaru/status/process-working-symbolic.svg" alt="Ubuntu Process Symbol" />
                        </div>
                        : null
                    )
                }
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit> </Gedit>;
}
