export const weatherImg = (weatherData) => {
    let iconName = "";

    try {

        const { CloudCoverageOBSERVATION, oneHourPrecipitationOBSERVATION } = weatherData;

        if ( CloudCoverageOBSERVATION ===0){
            iconName=  "clear";
        }



        
        if (CloudCoverageOBSERVATION === 1 || 2 ){
                iconName="fair";
            if (oneHourPrecipitationOBSERVATION<= 2.5){ // need to change obs tenMin to hour 
                iconName += "-light";// retunr fair/light rain 

            } else if (oneHourPrecipitationOBSERVATION <= 7.5){
                iconName += "-moderate"//return fair/moderate rain
            } else {
                iconName += "-heavy"//fair/heavy rain
            }

        }
        if (CloudCoverageOBSERVATION === 3 || 4 || 5){
            iconName = "partlycloudy"//return "partlycloudy";
            if (oneHourPrecipitationOBSERVATION<= 2.5){ // need to change obs tenMin to hour 
                // retunr partly cloudy/light rain 
                iconName += "-light";
            } else if (oneHourPrecipitationOBSERVATION <= 7.5){
                iconName += "-moderate" //return partly cloudy/moderate rain
            } else {
                iconName += "-heavy"//partly cloudy/heavy rain
            }

        }
        if (CloudCoverageOBSERVATION === 6 || 7){
            iconName = "mostlycloudy"//return "mostlycloudy";
            if (oneHourPrecipitationOBSERVATION<= 2.5){ // need to change obs tenMin to hour 
                iconName += "-light"// retunr mostlycloudy/light rain 

            } else if (oneHourPrecipitationOBSERVATION <= 7.5){
                iconName += "-moderate"//return mostlycloudy/moderate rain
            } else {
                iconName += "-heavy" //mostlycloudy/heavy rain
            }
        }

        if (CloudCoverageOBSERVATION === 8) {
           iconName = "overcast"// return "overcast";
           if (oneHourPrecipitationOBSERVATION<= 2.5){ // need to change obs tenMin to hour 
            iconName += "light"// retunr overcast/light rain 

        } else if (oneHourPrecipitationOBSERVATION <= 7.5){
            iconName += "-moderate"//return overcast/moderate rain
        } else {
            iconName += "-heavy"//overcast/heavy rain
        }
        }

        return iconName;

    } catch (error) { 
        console.error("Error in determining weather icon:", error);
        return "error"; 
        
    }

};