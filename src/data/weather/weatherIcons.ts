import type { IconType } from "react-icons";
import {
  WiDaySunny,
  WiNightClear,
  WiNightPartlyCloudy,
  WiNightAltPartlyCloudy,
  WiDayCloudy,
  WiDaySunnyOvercast,
  WiFog,
  WiDayRain,
  WiNightRain,
  WiDaySnow,
  WiNightSnow,
  WiDaySleet,
  WiNightSleet,
  WiDayRainMix,
  WiNightRainMix,
  WiDayThunderstorm,
  WiNightThunderstorm,
  WiDayShowers,
  WiNightShowers,
  WiDayHail,
  WiNightHail,
  WiDaySnowThunderstorm,
  WiNightSnowThunderstorm,
} from "react-icons/wi";

const weatherIcons: { [code: number]: { "1": IconType; "0": IconType } } = {
  1000: {
    "1": WiDaySunny,
    "0": WiNightClear,
  },
  1003: {
    "1": WiNightPartlyCloudy,
    "0": WiNightAltPartlyCloudy,
  },
  1006: {
    "1": WiDayCloudy,
    "0": WiNightPartlyCloudy,
  },
  1009: {
    "1": WiDaySunnyOvercast,
    "0": WiNightPartlyCloudy,
  },
  1030: {
    "1": WiFog,
    "0": WiFog,
  },
  1063: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1066: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1069: {
    "1": WiDaySleet,
    "0": WiNightSleet,
  },
  1072: {
    "1": WiDayRainMix,
    "0": WiNightRainMix,
  },
  1087: {
    "1": WiDayThunderstorm,
    "0": WiNightThunderstorm,
  },
  1114: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1117: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1135: {
    "1": WiFog,
    "0": WiFog,
  },
  1147: {
    "1": WiFog,
    "0": WiFog,
  },
  1150: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1153: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1168: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1171: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1180: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1183: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1186: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1189: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1192: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1195: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1201: {
    "1": WiDayRain,
    "0": WiNightRain,
  },
  1204: {
    "1": WiDaySleet,
    "0": WiNightSleet,
  },
  1207: {
    "1": WiDaySleet,
    "0": WiNightSleet,
  },
  1210: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1213: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1216: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1219: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1222: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1225: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1237: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1240: {
    "1": WiDayShowers,
    "0": WiNightShowers,
  },
  1243: {
    "1": WiDayShowers,
    "0": WiNightShowers,
  },
  1246: {
    "1": WiDayShowers,
    "0": WiNightShowers,
  },
  1249: {
    "1": WiDaySleet,
    "0": WiNightSleet,
  },
  1252: {
    "1": WiDaySleet,
    "0": WiNightSleet,
  },
  1255: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1258: {
    "1": WiDaySnow,
    "0": WiNightSnow,
  },
  1261: {
    "1": WiDayHail,
    "0": WiNightHail,
  },
  1264: {
    "1": WiDayHail,
    "0": WiNightHail,
  },
  1273: {
    "1": WiDayThunderstorm,
    "0": WiNightThunderstorm,
  },
  1276: {
    "1": WiDayThunderstorm,
    "0": WiNightThunderstorm,
  },
  1279: {
    "1": WiDaySnowThunderstorm,
    "0": WiNightSnowThunderstorm,
  },
  1282: {
    "1": WiDaySnowThunderstorm,
    "0": WiNightSnowThunderstorm,
  },
};

export default weatherIcons;
