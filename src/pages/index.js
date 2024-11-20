// index.js is the main file for the InfoScreen page.
import Head from 'next/head';

// Import only one component which handles the rest of the components which are related to the component.
import CameraServerComponent from '../components/example/ExampleServerComponent';
import MetarServerComponent from '@/components/metar/MetarServerComponent';
import RadarServerComponent from '@/components/rainRadar/RadarServerComponent';
import AdsbServerComponent from '@/components/adsb/AdsbServerComponent';
import RunwayServerComponent from '@/components/runway/RunwayServerComponent';
import NotamClientComponent from '@/components/notam/NotamClientComponent';
import WeatherServerComponent from '@/components/weather/WeatherServerComponent';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Head>
                <title>Info Demo</title>
                <meta name="description" content="Information Board Demo" />
            </Head>

            {/* Main container with two main divs side by side */}
            <div className="h-screen w-full flex justify-center items-center p-5 space-x-4">
                {/* Left Div */}
                <div className="w-3/5 h-full flex flex-row space-x-4">
                    {/* Left Container: Two components stacked vertically */}
                    <div className="flex flex-col justify-between w-2/5 h-full space-y-4">
                        {/* Top Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2">
                            <RunwayServerComponent />
                            {/*Runway here */}
                        </div>

                        {/* Bottom Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2">
                            <WeatherServerComponent />
                        </div>
                    </div>

                    {/*  Middle Container: Two components stacked vertically */}
                    <div className="flex flex-col justify-between w-3/5 h-full space-y-4 ">
                        {/* Top Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-2 h-1/2">
                            <RadarServerComponent />
                            {/*Radar here */}
                        </div>

                        {/* Bottom Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2">
                            <AdsbServerComponent />
                            {/* ads-B here */}
                        </div>
                    </div>
                </div>

                {/* Right Div */}
                <div className="w-2/5 h-full flex flex-col justify-between space-y-4">
                    {/* Top: Two components side by side */}
                    <div className="flex space-x-4 h-3/5">
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-1/2 h-full">
                            <MetarServerComponent />
                        </div>
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-1/2 h-full">
                            <CameraServerComponent />
                        </div>
                    </div>
                    {/* Bottom: One component */}
                    <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-full w-full">
                        <NotamClientComponent />
                        {/* Airport Notes here */}
                    </div>
                </div>
            </div>
        </div>
    );
}
