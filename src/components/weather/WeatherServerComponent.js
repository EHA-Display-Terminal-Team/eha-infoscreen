// components/notam/WeatherServerComponent.js

import { useEffect, useState, React } from 'react';
import styles from './cloud.module.css';

import forecast from '@/pages/api/forecast';
import observation from '@/pages/api/observation';
import Image from 'next/image';
import { weatherImg } from '@/pages/api/weatherIcon';
import { getIcon } from '@/pages/api/getWeatherIcon';


export default function WeatherServerComponent() {
    // Use the fetched weather data from CloudCover
    const [weatherData, setWeatherData] = useState(null);
    const iconName = weatherImg(weatherData); // icon names
    const [iconSrc, setIconSrc] = useState(null); //icon images

    //Observationdata and Forecastdata added together
    console.log(weatherData);

    const fetchData = async () => {
        try {
            const observationdata = await observation(); // Await the Promise
            const forecastdata = await forecast(); // Await the second Promise

            console.log('Fetched forecast data:', forecastdata);
            console.log('Fetched observation data:', observationdata);

            // Tarkistetaan, että forecastdata on olio
            if (forecastdata && typeof forecastdata === 'object') {
                if (observationdata && typeof observationdata === 'object') {
                    // Yhdistetään observationdata ja forecastdata yhteen objektiin ja päivitetään tila
                    setWeatherData({
                        forecast: forecastdata,
                        observation: observationdata,
                    });
                } else {
                    console.error(
                        'Invalid observation data received:',
                        observationdata
                    );
                }
            } else {
                console.error('Invalid forecast data received:', forecastdata);
            }
        } catch (error) {
            console.error('Error fetching data:', error); // Handle any errors
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data initially once

        // Set interval to refetch observation data every 10 minutes (600000 ms)
        const intervalId = setInterval(() => {
            fetchData();
        }, 60000); // 1 minutes in milliseconds

        // Clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures the effect runs only once at mount

    useEffect(() => {
        getIcon(iconName).then(setIconSrc);
    }, [iconName]); // call the getIcon function

    if (!iconSrc) return null;


    // Display loading state while data is being fetched
    if (!weatherData) {
        return <div>Loading...</div>; //basic loading screen
    }

    return (
        <div className={styles.box}>
            {/* <div>{weatherData.observation.suomiAika}</div> */}
            <div className={styles.imgcontainer}>
                <Image
                   // src="/images/sun.svg"
                    img src={iconSrc} alt={iconName}
                   // alt="Sun Icon"
                    width={50}
                    height={50}
                />
            </div>
            <div className={styles.infocontainer}>
                <div className={styles.left}>
                    <div>Temp:</div>
                    <div>Humidity:</div>
                    <div>Wind direction:</div>
                    <div>Precipitation:</div>
                    <div>Cloud cover:</div>
                    <div>Dewpoint:</div>
                    <div>Wind:</div>
                    <div>Wind gust:</div>
                    <div>Visibility:</div>
                    <div>Pressure:</div>
                </div>

                <div className={styles.right}>
                    <div className={styles.fade}>
                        {weatherData.observation.temperatureOBSERVATION} °C
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.humidityOBSERVATION} %
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.windDirectionOBSERVATION}°
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.tenMinPrecipitationOBSERVATION}{' '}
                        MM
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.CloudCoverageOBSERVATION}/8
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.dewPointOBSERVATION} °C
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.WindOBSERVATION} M/S</div>
                    <div className={styles.fade}>{weatherData.observation.WindGustOBSERVATION} M/S

                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.visibilityOBSERVATION} KM
                    </div>
                    <div className={styles.fade}>
                        {weatherData.observation.p_seaOBSERVATION} HPR
                    </div>
                </div>
            </div>
        </div>
        //KUVAT TOIMIVAT public kansiossa
    );
}
