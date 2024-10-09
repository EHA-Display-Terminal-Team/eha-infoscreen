// index.js is the main file for the InfoScreen page.
import Head from 'next/head';

// Import only one component which handles the rest of the components which are related to the component.
import CameraServerComponent from '../components/example/ExampleServerComponent';

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
                            <CameraServerComponent />
                        </div>

                        {/* Bottom Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2"></div>
                    </div>

                    {/*  Middle Container: Two components stacked vertically */}
                    <div className="flex flex-col justify-between w-3/5 h-full space-y-4">
                        {/* Top Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2"></div>

                        {/* Bottom Component */}
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-1/2"></div>
                    </div>
                </div>

                {/* Right Div */}
                <div className="w-2/5 h-full flex flex-col justify-between space-y-4">
                    {/* Top: Two components side by side */}
                    <div className="flex space-x-4 h-3/5">
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-1/2 h-full"></div>
                        <div className="bg-gray-700 rounded-lg shadow-lg p-6 w-1/2 h-full"></div>
                    </div>
                    {/* Bottom: One component */}
                    <div className="bg-gray-700 rounded-lg shadow-lg p-6 h-full w-full"></div>
                </div>
            </div>
        </div>
    );
}