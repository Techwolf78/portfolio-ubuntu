import React, { Component } from 'react';
import ReactGA from 'react-ga4';

export class AboutAjay extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "skills": <Skills />,
            "projects": <Projects />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (lastVisitedScreen === null || lastVisitedScreen === undefined) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen));
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "Custom Title" });


        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = () => {
        return (
            <>
                <div id="about" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="about ajay" src="./themes/Yaru/status/about.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">About Me</span>
                </div>
                <div id="education" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "education" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="ajay's education" src="./themes/Yaru/status/education.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Education</span>
                </div>
                <div id="skills" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "skills" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="ajay's skills" src="./themes/Yaru/status/skills.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Skills</span>
                </div>
                <div id="projects" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "projects" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="ajay's projects" src="./themes/Yaru/status/projects.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Projects</span>
                </div>
                <div id="resume" tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === "resume" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                    <img className=" w-3 md:w-4" alt="ajay's resume" src="./themes/Yaru/status/download.svg" />
                    <span className=" ml-1 md:ml-2 text-gray-50 ">Resume</span>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutAjay;

export const displayAboutAjay = () => {
    return <AboutAjay />;
}


function About() {
    return (
        <>
            <div className="w-20 h-20 md:w-28 md:h-28 my-4 bg-white rounded-full overflow-hidden border-2 border-white">
                <img className="w-full h-full object-cover" src="https://plus.unsplash.com/premium_photo-1734348383114-69bd3d9f8b79?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Ajay Pawar Logo" />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>my name is <span className="font-bold">Ajay Pawar</span> ,</div>
                <div className="font-normal ml-1">I'm a <span className="text-pink-600 font-bold">Full-stack Developer & UI/UX Designer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
            </div>
            <ul className=" mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
                <li className=" list-pc">I'm a <span className=" font-medium">Software Engineer</span> based in Pune, India. Currently, I'm working full-time at <u className=' cursor-pointer '> <a href="https://gryphonacademy.co.in/" target={"_blank"} rel="noreferrer">Gryphon Academy Pvt. Ltd.</a> </u> building innovative CRM solutions. ( Hit me up <a className='text-underline' href='mailto:ajaypawargryphon@gmail.com'><u>@ajaypawargryphon@gmail.com</u></a> :) )</li>
                <li className=" mt-3 list-building"> I enjoy building scalable applications, designing beautiful user interfaces, and automating complex workflows.</li>
                <li className=" mt-3 list-time"> When I am not coding my next project, I like to design UI/UX concepts, contribute to open-source, or read up on SaaS architectures.</li>
                <li className=" mt-3 list-star"> I've also done extensive work with Firebase, Node.js, AWS, and modern animated frontends using GSAP/Three.js!</li>
            </ul>
        </>
    )
}
function Education() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Experience & Education
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                <li className="list-disc">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Software Engineer - Gryphon Academy
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">Aug 2024 - Present</div>
                    <div className=" text-sm md:text-base">Full-time, Baner, Pune</div>
                    <div className="text-sm text-gray-300 mt-1 font-normal">
                        Building CRM solutions, lead tracking pipeline, role-based auth, and UI animation systems.
                    </div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Full Stack Java Development - ExcelR
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">Feb 2024 - May 2024</div>
                    <div className=" text-sm md:text-base">Internship / Training, Pune</div>
                    <div className="text-sm text-gray-300 mt-1 font-normal">
                        Comprehensive training in Java development, databases, version control, and web architectures.
                    </div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Account Manager - Amazon Seller
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">May 2023 - Aug 2023</div>
                    <div className=" text-sm md:text-base">Freelance, Remote</div>
                    <div className="text-sm text-gray-300 mt-1 font-normal">
                        Managed product listings, advertising campaigns, and sales analytics for optimal visibility.
                    </div>
                </li>
                <li className="list-disc mt-5">
                    <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                        Web Developer Intern - YHills
                    </div>
                    <div className=" text-sm text-gray-400 mt-0.5">Feb 2023 - Mar 2023</div>
                    <div className=" text-sm md:text-base">Internship, Remote</div>
                    <div className="text-sm text-gray-300 mt-1 font-normal">
                        Developed responsive educational websites and resource hubs using HTML, CSS, and JavaScript.
                    </div>
                </li>
            </ul>
        </>
    )
}
function Skills() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Technical Skills
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    I've worked with a wide variety of programming languages, libraries & cloud services.
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div> My areas of expertise are <strong className="text-ubt-gedit-orange">front-end development, React.js, Node.js & Full-stack architecture!</strong></div>
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div>Here are my most frequently used skills:</div>
                </li>
            </ul>
            <div className="w-full md:w-10/12 flex mt-4">
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Languages & Tools</div>
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Frameworks & Libraries</div>
            </div>
            <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
                <div className="px-2 w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className="m-1" src="https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A" alt="ajay javascript" />
                        <img className="m-1" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="ajay typescript" />
                        <img className="m-1" src="http://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=ffffff" alt="ajay python" />
                        <img className="m-1" src="https://img.shields.io/badge/-HTML5-%23E44D27?style=flat&logo=html5&logoColor=ffffff" alt="ajay HTML" />
                        <img src="https://img.shields.io/badge/-CSS3-%231572B6?style=flat&logo=css3&logoColor=ffffff" alt="ajay CSS" className="m-1" />
                        <img src="https://img.shields.io/badge/-Git-%23F05032?style=flat&logo=git&logoColor=%23ffffff" alt="ajay git" className="m-1" />
                        <img src="https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=ffffff" alt="ajay firebase" className="m-1" />
                        <img src="https://img.shields.io/badge/-AWS-232F3E?style=flat&logo=amazon-aws&logoColor=white" alt="ajay aws" className="m-1" />
                    </div>
                </div>
                <div className="px-2 flex flex-wrap items-start w-1/2">
                    <div className="flex flex-wrap justify-center items-start w-full mt-2">
                        <img className=" m-1" src="https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=ffffff" alt="ajay react" />
                        <img className=" m-1" src="https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=ffffff" alt="ajay next" />
                        <img className="m-1" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="ajay tailwind css" />
                        <img src="https://img.shields.io/badge/-Nodejs-339933?style=flat&logo=Node.js&logoColor=ffffff" alt="ajay node.js" className="m-1" />
                        <img src="https://img.shields.io/badge/-GraphQL-E10098?style=flat&logo=graphql&logoColor=white" alt="ajay graphql" className="m-1" />
                        <img className="m-1" src="https://img.shields.io/badge/Redux-593D88?style=flat&logo=redux&logoColor=white" alt="ajay redux" />
                    </div>
                </div>
            </div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list mt-4">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <span> And of course, professional </span> <img className=" inline ml-1" src="https://img.shields.io/badge/-UI%2FUX%20Design-FF61F6?style=flat" alt="ajay design" /> <span> tools like Figma!</span>
                </li>
            </ul>
        </>
    )
}

function Projects() {
    const project_list = [
        {
            name: "Knest – AI-Powered Second Brain",
            date: "2025",
            link: "https://github.com/Techwolf78",
            description: [
                "An AI-powered productivity tool serving as your personal second brain.",
                "Remembers context, connects your notes, tracks habits, and plans your day automatically.",
                "Connected thinking visualization resembling a neural network.",
            ],
            domains: ["react", "next.js", "tailwindcss", "typescript"]
        },
        {
            name: "Gryphon Academy Website",
            date: "2024",
            link: "https://github.com/Techwolf78",
            description: [
                "Dynamic, visually engaging company website with complex interactive elements.",
                "Leveraged AOS, GSAP, and Three.js for high-performance animations.",
                "100% responsive layout optimized across all modern mobile and desktop browsers.",
            ],
            domains: ["react", "tailwindcss", "javascript"]
        },
        {
            name: "PlayStation Showcase Website",
            date: "2024",
            link: "https://github.com/Techwolf78",
            description: [
                "A modern concept showcasing PlayStation products and controllers.",
                "Smooth transitions and brand-matching futuristic design patterns.",
            ],
            domains: ["react", "tailwindcss", "javascript"]
        },
        {
            name: "CRM Web Application",
            date: "2024",
            link: "https://github.com/Techwolf78",
            description: [
                "Full-featured CRM with sales pipelines, lead tracking, L&D modules, and role-based auth.",
                "Integrated real-time logging, query index optimizations, and caching to reduce load times to 0.9s.",
            ],
            domains: ["react", "firebase", "tailwindcss"]
        },
        {
            name: "HR Attendance System",
            date: "2024",
            link: "https://github.com/Techwolf78",
            description: [
                "Complete HR attendance management platform deployed on Render.",
                "Optimized app bundles and resource loading to reduce page load from 20s to 2s.",
            ],
            domains: ["react", "node.js"]
        },
        {
            name: "ShineX - Doorstep Vehicle Wash",
            date: "2025",
            link: "https://github.com/Techwolf78",
            description: [
                "Premium washing service listing platform with packages, contact form via EmailJS, and testimonial slides.",
            ],
            domains: ["react", "tailwindcss"]
        }
    ];

    const tag_colors = {
        "react": "blue-400",
        "next.js": "purple-600",
        "tailwindcss": "blue-300",
        "typescript": "blue-500",
        "javascript": "yellow-300",
        "firebase": "red-600",
        "node.js": "green-600"
    }

    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                    <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
                </div>
            </div>

            {
                project_list.map((project, index) => {
                    return (
                        <a key={index} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2 font-medium">{project.name}</div>
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                    {
                                        (project.domains ?
                                            project.domains.map((domain, index) => {
                                                return <span key={index} className={`px-1.5 py-0.5 w-max border border-${tag_colors[domain] || 'gray-400'} text-${tag_colors[domain] || 'gray-400'} m-1 rounded-full`}>{domain}</span>
                                            })

                                            : null)
                                    }
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}
function Resume() {
    return (
        <iframe className="h-full w-full" src="./files/Ajay_Pawar_Resume.pdf" title="ajay pawar resume" frameBorder="0"></iframe>
    )
}
