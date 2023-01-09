import { MapContainer, TileLayer } from "react-leaflet";
import Markerposition from "./components/markerposition";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { useEffect, useState } from "react";
import image from "./images/pattern-bg.png";
import arrow from "./images/icon-arrow.svg";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${
            process.env.REACT_APP_KEY
          }&${
            checkIpAddress.test(ipAddress)
              ? `ipAddress=${ipAddress}`
              : checkDomain.test(ipAddress)
              ? `domain=${ipAddress} `
              : ""
          }`
        );
        const data = await res.json();
        setAddress(data);
      };
      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  async function getEnterAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_KEY}&ipAddress=192.212.174.101`
    );
    const data = await res.json();
    setAddress(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    getEnterAddress();
    setIpAddress("");
  }

  return (
    <div className="App">
      <div className="pattern">
        <img src={image} className="image" alt="" />
      </div>
      <form autoComplete="off" onSubmit={handleSubmit} className="user">
        <h1 className="head">IP Address Tracker</h1>
        <div className="interface">
          <input
            type="text"
            placeholder="search for an IP address or domain"
            className="input"
            value={ipAddress}
            onChange={(e) => {
              setIpAddress(e.target.value);
            }}
          />
          <button className="click">
            <img src={arrow} alt="" />
          </button>
        </div>
      </form>
      {address && (
        <>
          <div className="conditions">
            <div className="address">
              <h1 className="style">IP ADDRESS</h1>
              <h1 className="number">{address.ip}</h1>
            </div>
            <div className="address">
              <h1 className="style">Location</h1>
              <h1 className="number">
                {address.location.city} ,{address.location.region}
              </h1>
            </div>
            <div className="address">
              <h1 className="style">Time Zone </h1>
              <h1 className="number">UTC{address.location.timezone}</h1>
            </div>
            <div className="address">
              <h1 className="style">ISP</h1>
              <h1 className="number">{address.isp}</h1>
            </div>
          </div>

          <div className="location">
            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "600px", width: "100vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markerposition address={address} />
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
