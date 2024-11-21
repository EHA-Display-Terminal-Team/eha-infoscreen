export default async function observation() {
    const currentTime = new Date(); // Alustetaan nykyinen aika Date-objektina
    const oneHourAgo = new Date(currentTime.getTime() - 1 * 60 * 60 * 1000); // Tallennetaan aikaleima 1h sitten

    const urls = [
        `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::multipointcoverage&place=pyhtää`,
        `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::multipointcoverage&place=pyhtää&starttime=${oneHourAgo.toISOString()}`,
    ];

    console.log('ObservationURL:', urls[1]);

    //Nyt ensimmäinen aikaleima on tasan 1h sitten, ja viimeinen on nykyhetki

    try {
        // Fetch both URLs concurrently
        const responses = await Promise.all(
            urls.map((url) =>
                fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/xml',
                    },
                })
            )
        );

        responses.forEach((response, index) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP error on URL ${urls[index]}! Status: ${response.status}`
                );
            }
        });

        const [forecastText, observationText] = await Promise.all(
            responses.map((res) => res.text())
        );
        const parser = new DOMParser();
        const observationXML = parser.parseFromString(
            observationText,
            'application/xml'
        );

        //console.log('Observation Data:', observationXML);

        // Hakee kaikki <gml:doubleOrNilReasonTupleList> elementit
        const totalCloudCoverageElements = observationXML.getElementsByTagName(
            'gml:doubleOrNilReasonTupleList'
        );
        let weatherData = {};

        if (totalCloudCoverageElements.length > 0) {
            const cloudCoverageRaw =
                totalCloudCoverageElements[0].textContent.trim();

            // Jaa rivinvaihtojen mukaan ja ota ensimmäinen arvo
            const cloudCoverageArray = cloudCoverageRaw.split('\n');

            // Halutaan listan viimeisimmät 13 arvoa, eli uusimmat havainnot:
            const lastObservation = cloudCoverageArray[
                cloudCoverageArray.length - 1
            ]
                .trim()
                .split(' ');

            const temperatureOBSERVATION = lastObservation[0];
            const WindOBSERVATION = lastObservation[1];
            const WindGustOBSERVATION = lastObservation[2];
            const windDirectionOBSERVATION = lastObservation[3];
            const humidityOBSERVATION = lastObservation[4];
            const dewPointOBSERVATION = lastObservation[5];
            const oneHourPrecipitationOBSERVATION = lastObservation[6]; //Sademäärä edellisen tunnin aikana
            const tenMinPrecipitationOBSERVATION = lastObservation[7]; //Sademäärä viimeisen 10Minuutin aikana
            const snow_awsOBSERVATION = lastObservation[8]; //Lumen syvyys (CM)
            const p_seaOBSERVATION = lastObservation[9]; //Merenpinnan paine
            const visibilityOBSERVATION = Math.round(
                lastObservation[10] / 1000
            ); //Näkyvyys metreinä
            const CloudCoverageOBSERVATION = ~~lastObservation[11]; //(?/8)
            const wawaOBSERVATION = lastObservation[12]; //Nykyinen sääilmiö

            // Assign weather data into the object
            weatherData = {
                temperatureOBSERVATION,
                WindOBSERVATION,
                WindGustOBSERVATION,
                windDirectionOBSERVATION,
                humidityOBSERVATION,
                dewPointOBSERVATION,
                oneHourPrecipitationOBSERVATION,
                tenMinPrecipitationOBSERVATION,
                snow_awsOBSERVATION,
                p_seaOBSERVATION,
                visibilityOBSERVATION,
                CloudCoverageOBSERVATION,
                wawaOBSERVATION,
            };
        } else {
            console.warn('Pilvisyysarvoja ei löytynyt.');
        }

        // Hakee <gmlcov:positions> elementit aikaleimojen löytämiseksi
        const timePositionElements =
            observationXML.getElementsByTagName('gmlcov:positions');
        if (timePositionElements.length > 0) {
            const timePosition = timePositionElements[0].textContent.trim();
            const positionsArray = timePosition.split(/\s+/); // Jaa välilyöntien perusteella
            if (positionsArray.length >= 3) {
                const latestTimestamp =
                    positionsArray[positionsArray.length - 1]; // Ota viimeinen aikaleima (listan viimeinen arvo)
                //console.log('Timestamp:', latestTimestamp);

                // Muunna aikaleima millisekunteihin ja luo uusi Date-objekti
                const date = new Date(latestTimestamp * 1000);

                // Aseta Suomen aikavyöhyke käyttäen toLocaleString-funktiota
                const suomiAika = date.toLocaleString('fi-FI', {
                    timeZone: 'Europe/Helsinki',
                });
                // Include the timestamp in the weatherData object
                weatherData.suomiAika = suomiAika;
            } else {
                console.log('Aikaleima ei löytynyt.');
            }
        } else {
            console.log('Time Position - Elementtiä ei löytynyt.');
        }

        // Return all data, including weather details and timestamp
        return weatherData;
    } catch (error) {
        console.error('Virhe haettaessa XML-tiedostoa:', error);
    }
}
