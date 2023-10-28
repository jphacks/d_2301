/**
 * WeatherAPIをたたいてログ出力する関数
 * @param location
 */
async function fetchWeatherData(location) {
  // 天気予報データの定義
  const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  // 天気予報データのURL
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;

  let weatherData = [];

  // URLを使ってAPIからデータを取得
  await fetch(url, {
    method: "get",
  })
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.list.length; i++) {
        if (i % 2 === 0) {
          const jst = new Date(data.list[i].dt * 1000).toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          });
          const pressure = data.list[i].main.pressure;
          weatherData.push({ pressure });
        }
      }
    });
  return weatherData;
}

export { fetchWeatherData };

const TIME_INTERVAL = 3;

export function weatherDataTimes() {
  const now = new Date();
  const times = [];

  for (let i = 1; i < 21; i++) {
    const time = new Date(now.getTime() + i * TIME_INTERVAL * 60 * 60 * 1000);
    time.setMinutes(0);
    time.setSeconds(0);

    const timeString =
      time.getMonth() + "月" + time.getDate() + "日 " + time.getHours() + "時";
    times.push(
      time.getMonth() + "月" + time.getDate() + "日 " + time.getHours() + "時"
    );
  }

  return times;
}

export { fetchWeatherData };
