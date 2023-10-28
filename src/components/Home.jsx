import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { getLocations } from "../firebase/database";
import {
  DateTime,
  Pressure,
  Location,
} from "../pressureData/test_pressureData";
import { fetchWeatherData, weatherDataTimes } from "../APIfunction/weatherAPI";

const Home = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const auth = getAuth(app);

  const handleLogout = () => {
    auth.signOut();
    navigate("/signin");
  };
  const handleRegister = () => {
    navigate("/register_location");
  };

  useEffect(() => {
    let isSubscribe = false;
    const async = async () => {
      const dbLocations = await getLocations(user.uid);
      const data = [];

      let n = 1;
      dbLocations.forEach((location) => {
        const a = async () => {
          data.push({
            id: location.id,
            location: location.location,
          });
          const pressure = await fetchWeatherData(location.location);
          console.log(isSubscribe);
          if (!isSubscribe) {
            data.push({
              id: location.id,
              location: location.location,
            });
          }
        };
        a();
      });

      setLocations(data);
    };

    async().then(() => {
      return () => {
        isSubscribe = true;
      };
    });
  }, []);

  const tableRow = [];
  locations.map((location) => {
    tableRow.push(<td>a</td>);
    const a = async () => {
      tableRow.push(<td>b</td>);
      clearTimeout(await setTimeout(1000000));
      tableRow.push(<td>c</td>);
      const pressure = await fetchWeatherData(location.location);
      tableRow.push(<td>d</td>);
    };
    fetchWeatherData(location.location).then(() => {
      tableRow.push(<td>f</td>);
    });
    a();
    tableRow.push(<td>e</td>);
  });

  if (!user) {
    return <Navigate to="/signin" />;
  } else {
    return (
      <div>
        <h1>ホームページ</h1>
        <p>ユーザーそれぞれでurl変えないといけない</p>
        <p>登録地点</p>
        {locations.map((location) => (
          <p key={location.id}>{location.location}</p>
        ))}
        <table>
          <thead>
            <tr>
              <th>地点</th>
              {weatherDataTimes().map((date) => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr>
                <td key={location}>{location.location}</td>
                {/* {location.pressure.map((pressure) => {
                  <td key={location + pressure}>{pressure}</td>;
                })} */}
                {tableRow}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleRegister}>地点登録</button>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }
};

export { Home };
