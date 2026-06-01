import React, { Component } from 'react';

export class Weather extends Component {
    constructor() {
        super();
        this.state = {
            searchQuery: '',
            currentCity: 'New York',
            country: 'US',
            temp: 20,
            feelsLike: 20,
            condition: 'Clear',
            description: 'clear sky',
            iconCode: '01d',
            humidity: 50,
            windSpeed: 5,
            pressure: 1013,
            forecast: [],
            loading: true,
            error: null,
            unit: 'C' // 'C' or 'F'
        };
    }

    componentDidMount() {
        const savedCity = localStorage.getItem('last_weather_city') || 'New York';
        this.fetchWeatherData(savedCity);
    }

    parseForecast = (list) => {
        const dailyData = {};
        const todayStr = new Date().toISOString().split('T')[0];
        
        list.forEach(item => {
            const dateStr = item.dt_txt.split(' ')[0];
            if (dateStr === todayStr) return; // Skip today's weather
            
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = [];
            }
            dailyData[dateStr].push(item);
        });

        const forecast = [];
        const days = Object.keys(dailyData).sort();
        
        for (let i = 0; i < Math.min(3, days.length); i++) {
            const dateStr = days[i];
            const dayItems = dailyData[dateStr];
            const midItem = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[Math.floor(dayItems.length / 2)];
            
            const dateObj = new Date(dateStr + "T00:00:00");
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            forecast.push({
                day: dayName,
                temp: Math.round(midItem.main.temp),
                cond: midItem.weather[0].main,
                iconCode: midItem.weather[0].icon
            });
        }
        return forecast;
    };

    fetchWeatherData = async (city) => {
        this.setState({ loading: true, error: null });
        const apiKey = '7e4e12509fc2ed5e48a643a79a028134';
        
        try {
            const weatherRes = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
            );
            if (!weatherRes.ok) {
                let errText = 'Failed to load weather details';
                if (weatherRes.status === 401) {
                    errText = 'Unauthorized (401) - API key is invalid or activating.';
                } else if (weatherRes.status === 404) {
                    errText = 'Not Found (404) - City was not found.';
                } else if (weatherRes.status === 403) {
                    errText = 'Forbidden (403) - Access denied by OpenWeather API.';
                } else {
                    errText = `Internal Error (Code: ${weatherRes.status}) - ${weatherRes.statusText || 'Fetch failed'}`;
                }
                throw new Error(errText);
            }
            const weatherData = await weatherRes.json();

            const forecastRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
            );
            
            let forecast = [];
            if (forecastRes.ok) {
                const forecastData = await forecastRes.json();
                forecast = this.parseForecast(forecastData.list);
            }

            this.setState({
                currentCity: weatherData.name,
                country: weatherData.sys.country,
                temp: Math.round(weatherData.main.temp),
                feelsLike: Math.round(weatherData.main.feels_like),
                condition: weatherData.weather[0].main,
                description: weatherData.weather[0].description,
                iconCode: weatherData.weather[0].icon,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                pressure: weatherData.main.pressure,
                forecast: forecast,
                loading: false
            });

            localStorage.setItem('last_weather_city', weatherData.name);
        } catch (err) {
            console.error(err);
            this.setState({
                error: err.message || 'An error occurred while fetching weather details',
                loading: false
            });
        }
    };

    handleSearchSubmit = (e) => {
        e.preventDefault();
        const city = this.state.searchQuery.trim();
        if (city.length > 0) {
            this.fetchWeatherData(city);
            this.setState({ searchQuery: '' });
        }
    }

    toggleUnit = () => {
        this.setState({ unit: this.state.unit === 'C' ? 'F' : 'C' });
    }

    convertTemp = (celsius) => {
        if (this.state.unit === 'F') {
            return Math.round((celsius * 9) / 5 + 32);
        }
        return celsius;
    }

    capitalizeDesc = (desc) => {
        return desc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    getWeatherThemeColor = (cond) => {
        switch (cond) {
            case 'Clear':
                return 'from-[#e95420]/15 to-[#333333] border-[#e95420]/30';
            case 'Rain':
            case 'Drizzle':
            case 'Thunderstorm':
                return 'from-blue-500/10 to-[#333333] border-blue-500/20';
            case 'Snow':
                return 'from-cyan-400/10 to-[#333333] border-cyan-400/20';
            default: // Clouds, Atmosphere
                return 'from-zinc-500/10 to-[#333333] border-zinc-700/40';
        }
    }

    render() {
        const { currentCity, country, temp, feelsLike, condition, description, iconCode, humidity, windSpeed, pressure, forecast, loading, error, unit } = this.state;
        const themeColorClass = this.getWeatherThemeColor(condition);
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        return (
            <div className="h-full w-full bg-[#181818] flex flex-col items-center p-4 text-[#e6e6e6] font-sans select-none overflow-y-auto">
                <div className="w-full max-w-md bg-[#242424] rounded-2xl border border-[#333333] shadow-2xl overflow-hidden flex flex-col relative min-h-[380px]">
                    
                    {/* Minimal GNOME Search Header */}
                    <div className="flex gap-2 p-3.5 bg-[#1e1e1e] border-b border-[#2d2d2d] items-center">
                        <form onSubmit={this.handleSearchSubmit} className="flex-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">🔍</span>
                                <input
                                    type="text"
                                    value={this.state.searchQuery}
                                    onChange={(e) => this.setState({ searchQuery: e.target.value })}
                                    placeholder="Search city..."
                                    className="w-full bg-[#2d2d2d] hover:bg-[#333333] border border-[#3d3d3d] rounded-full pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#E95420] transition-all font-medium"
                                />
                            </div>
                        </form>
                        
                        <button
                            type="button"
                            onClick={this.toggleUnit}
                            className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#3d3d3d] text-xs font-semibold px-3 py-1.5 rounded-full transition-all text-zinc-300 active:scale-95"
                            title="Toggle Unit"
                        >
                            °{unit}
                        </button>
                    </div>

                    {/* Content view states */}
                    {loading ? (
                        <div className="flex-grow py-20 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-[#E95420]/30 border-t-[#E95420] rounded-full animate-spin"></div>
                            <span className="text-zinc-500 text-xs font-medium">Fetching live weather...</span>
                        </div>
                    ) : error ? (
                        <div className="flex-grow py-12 px-6 flex flex-col items-center text-center justify-center">
                            <span className="text-4xl mb-3">⚠️</span>
                            <h3 className="text-sm font-bold text-red-400">Weather API Error</h3>
                            <p className="text-xs text-zinc-400 mt-3 px-2 max-w-[300px] leading-relaxed font-mono">
                                {error}
                            </p>
                            <button
                                onClick={() => this.fetchWeatherData(currentCity || 'New York')}
                                className="mt-8 bg-[#E95420] hover:bg-[#ff6936] text-white text-xs font-bold px-5 py-2 rounded-full transition-all active:scale-95 shadow-md shadow-[#E95420]/20"
                            >
                                Retry Connection
                            </button>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col">
                            
                            {/* Main Relaxed Panel */}
                            <div className={`p-6 bg-gradient-to-b ${themeColorClass} border-b border-[#2d2d2d] flex flex-col items-center relative transition-all duration-700`}>
                                
                                {/* City and Country Tag */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold tracking-tight text-white">{currentCity}</h2>
                                    <span className="text-[10px] bg-white/10 text-zinc-300 font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider">
                                        {country}
                                    </span>
                                </div>

                                {/* Weather graphic and Temperature */}
                                <div className="flex items-center justify-center my-2.5 w-full gap-4">
                                    <img 
                                        src={iconUrl} 
                                        alt={condition} 
                                        className="w-24 h-24 object-contain filter drop-shadow-lg select-none"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-5xl font-light text-white font-mono leading-none">
                                            {this.convertTemp(temp)}<span className="text-2xl font-normal text-zinc-400">°</span>
                                        </div>
                                        <span className="text-xs font-semibold text-[#E95420] mt-1.5 tracking-wide">
                                            {this.capitalizeDesc(description)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Weather Details (Clean Muted Cards) */}
                            <div className="p-4 bg-[#242424] space-y-4 flex-grow">
                                <div className="grid grid-cols-2 gap-3">
                                    
                                    {/* Feels Like Card */}
                                    <div className="bg-[#1e1e1e] p-3 rounded-xl border border-[#2d2d2d] hover:border-zinc-800 transition-all flex flex-col justify-between">
                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Feels Like</span>
                                        <span className="text-sm font-semibold mt-1 font-mono text-zinc-200">{this.convertTemp(feelsLike)}°{unit}</span>
                                    </div>

                                    {/* Humidity Card */}
                                    <div className="bg-[#1e1e1e] p-3 rounded-xl border border-[#2d2d2d] hover:border-zinc-800 transition-all flex flex-col justify-between">
                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Humidity</span>
                                        <span className="text-sm font-semibold mt-1 font-mono text-zinc-200">{humidity}%</span>
                                    </div>

                                    {/* Wind speed Card */}
                                    <div className="bg-[#1e1e1e] p-3 rounded-xl border border-[#2d2d2d] hover:border-zinc-800 transition-all flex flex-col justify-between">
                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Wind Speed</span>
                                        <span className="text-sm font-semibold mt-1 font-mono text-zinc-200">{windSpeed} m/s</span>
                                    </div>

                                    {/* Pressure Card */}
                                    <div className="bg-[#1e1e1e] p-3 rounded-xl border border-[#2d2d2d] hover:border-zinc-800 transition-all flex flex-col justify-between">
                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Pressure</span>
                                        <span className="text-sm font-semibold mt-1 font-mono text-zinc-200">{pressure} hPa</span>
                                    </div>
                                </div>

                                {/* 3-Day Forecast Section */}
                                {forecast.length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-3 pl-1">3-Day Forecast</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {forecast.map((fc, index) => (
                                                <div 
                                                    key={index} 
                                                    className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl p-3 flex flex-col items-center transition-all hover:bg-[#202020] hover:scale-[1.02]"
                                                >
                                                    <span className="text-[10px] text-zinc-400 font-semibold">{fc.day}</span>
                                                    <img 
                                                        src={`https://openweathermap.org/img/wn/${fc.iconCode}.png`} 
                                                        alt={fc.cond}
                                                        className="w-10 h-10 my-0.5 object-contain"
                                                    />
                                                    <span className="text-xs font-bold font-mono text-white">{this.convertTemp(fc.temp)}°</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Weather;

export const displayWeather = () => {
    return <Weather></Weather>;
};
