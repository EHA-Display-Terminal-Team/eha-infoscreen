from flask import Flask, jsonify
from flask_cors import CORS
from urllib.request import urlopen
from bs4 import BeautifulSoup

# creates an instance of the Flask class
app = Flask(__name__)
# to enable cors for all routes
CORS(app)

def fetch_notams():
    #url = "https://lentopaikat.fi/notam/notam.php?a=EFPR"
    url = "https://lentopaikat.fi/notam/notam.php?a=EFHK"
    page = urlopen(url)
    html_bytes = page.read()
    raw_html = html_bytes.decode("ISO-8859-1")
    cleaned_html = BeautifulSoup(raw_html, "lxml").text.strip()

    return cleaned_html[18::]

# router route /api/data 
@app.route("/api/data", methods=["GET"])
def get_data():
    notam_data = fetch_notams()
    return jsonify({
        "message": notam_data,
        "status": "success"
    })

if __name__ == "__main__":
    #starts the Flask development server 
    # runs in debug mode
    app.run(debug=True)
    # runs the app at localhost:5000 (default port)
    #app.run(port=5000)