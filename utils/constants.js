import Image from "next/image";
import Python from "../public/static/assets/icons/python.svg";
import Ruby from "../public/static/assets/icons/ruby.svg";
import Javascript from "../public/static/assets/icons/javascript.svg";
import WebDev from "../public/static/assets/icons/web_dev.svg";
import Java from "../public/static/assets/icons/java.svg";
import Git from "../public/static/assets/icons/git.svg";
import Algorithms from "../public/static/assets/icons/algorithms.svg";
import Mobile from "../public/static/assets/icons/mobile.svg";
import ABTesting from "../public/static/assets/icons/a_b_testing.svg";
import SQL from "../public/static/assets/icons/sql.svg";
import SystemDesign from "../public/static/assets/icons/system_design.svg";
import Testing from "../public/static/assets/icons/testing.svg";
import { skillStrings, experienceStrings } from "./strings";

export const PAGES = ["home", "about", "experience", "contact"];

const DESKTOP =
  "https://hurley-site-images.s3-eu-west-1.amazonaws.com/minified_new/desktop/";
const MOBILE =
  "https://hurley-site-images.s3-eu-west-1.amazonaws.com/minified_new/mobile/";

// Hero carousel manifest. Replaces the two bare id arrays (BACKGROUNDS /
// MOBILE_BACKGROUNDS), which carried no alt text and no locations.
//
// Selection draws only from entries that have a mobileSrc, on every viewport.
// The desktop bucket holds 14 images but only 7 have mobile crops; mixing the
// pools breaks when a desktop visitor rotates into the mobile breakpoint,
// because the chosen set is fixed for the visit and cannot be repaired after
// the fact. Adding mobile crops for eight..fourteen would restore the rest.
export const HERO_IMAGES = [
  {
    id: "first",
    alt: "Standing on the edge of Table Mountain looking down over Table Bay and the city of Cape Town at dusk",
    location: "Table Mountain, Cape Town",
    desktopSrc: "/static/assets/images/first_image.webp",
  },
  {
    id: "one",
    alt: "Sitting on a stone wall above the Atlantic on the Cape Peninsula coast road, with a mountain headland in the haze behind",
    location: "Cape Peninsula, Cape Town",
    desktopSrc: `${DESKTOP}one.jpg`,
    mobileSrc: `${MOBILE}one.jpg`,
  },
  {
    id: "two",
    alt: "Standing on the Capitol terrace with the National Mall and the Washington Monument stretching away behind",
    location: "National Mall, Washington DC",
    desktopSrc: `${DESKTOP}two.jpg`,
    mobileSrc: `${MOBILE}two.jpg`,
  },
  {
    id: "three",
    alt: "Outside the floodlit Grand Ole Opry House in Nashville at night",
    location: "Grand Ole Opry, Nashville",
    desktopSrc: `${DESKTOP}three.jpg`,
    mobileSrc: `${MOBILE}three.jpg`,
  },
  {
    id: "four",
    alt: "In front of the waterfall beneath the Universal Studios Hollywood entrance sign",
    location: "Universal Studios, Los Angeles",
    desktopSrc: `${DESKTOP}four.jpg`,
    mobileSrc: `${MOBILE}four.jpg`,
  },
  {
    id: "five",
    alt: "Leaning on the red railing of the Golden Gate Bridge with the San Francisco skyline across the bay",
    location: "Golden Gate Bridge, San Francisco",
    desktopSrc: `${DESKTOP}five.jpg`,
    mobileSrc: `${MOBILE}five.jpg`,
  },
  {
    id: "six",
    alt: 'Beside the "Welcome to Springfield" sign in the Simpsons area of Universal Studios Hollywood',
    location: "Universal Studios, Los Angeles",
    desktopSrc: `${DESKTOP}six.jpg`,
    mobileSrc: `${MOBILE}six.jpg`,
  },
  {
    id: "seven",
    alt: "Standing above the Machu Picchu ruins with cloud breaking over the mountains behind",
    location: "Machu Picchu, Peru",
    desktopSrc: `${DESKTOP}seven.jpg`,
    mobileSrc: `${MOBILE}seven.jpg`,
  },
];

// Birth date was a literal buried in components/About/rightRail.
export const BIRTH_DATE = "1994/07/14";

export const FIRST_IMAGE_PATH = "/static/assets/images/first_image.webp";

export const DESKTOP_IMAGE_PATH =
  "https://hurley-site-images.s3-eu-west-1.amazonaws.com/minified_new/desktop/";

export const MOBILE_IMAGE_PATH =
  "https://hurley-site-images.s3-eu-west-1.amazonaws.com/minified_new/mobile/";

export const NUMBER_OF_IMAGES = 6;

export const LEFT_KEY = "ArrowLeft";

export const RIGHT_KEY = "ArrowRight";

export const MAP_ZOOM = 13;

export const LOCATIONS = [
  {
    name: "galway",
    lat: 53.27,
    lng: -9.057,
  },
  {
    name: "dublin",
    lat: 53.35,
    lng: -6.26,
  },
  {
    name: "sf",
    lat: 37.8,
    lng: -122.42,
  },
];

export const EMAIL = "jhurley070@gmail.com";

export const PHONE = "+35385-242-8831";

export const MAP_STYLES = [
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#444444",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [
      {
        color: "#f2f2f2",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: 45,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [
      {
        visibility: "simplified",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      {
        color: "#46bcec",
      },
      {
        visibility: "on",
      },
    ],
  },
];

export const SKILLS = [
  {
    name: "web_development",
    title: "Web Development",
    content: skillStrings.webDevelopment,
    icon: <Image src={WebDev} alt="web_development" />,
  },
  {
    name: "python",
    title: "Python",
    content: skillStrings.python,
    icon: <Image src={Python} alt="python" />,
  },
  {
    name: "javascript",
    title: "Javascript",
    content: skillStrings.javascript,
    icon: <Image src={Javascript} alt="javascript" />,
  },
  {
    name: "ruby",
    title: "Ruby",
    content: skillStrings.ruby,
    icon: <Image src={Ruby} alt="ruby" />,
  },
  {
    name: "java",
    title: "Java",
    content: skillStrings.java,
    icon: <Image src={Java} alt="java" />,
  },
  {
    name: "git",
    title: "Git",
    content: skillStrings.git,
    icon: <Image src={Git} alt="git" />,
  },
  {
    name: "mobile_development",
    title: "Mobile Development",
    content: skillStrings.mobile,
    icon: <Image src={Mobile} alt="mobile_development" />,
  },
  {
    name: "algorithms",
    title: "Algorithms & Data Structures",
    content: skillStrings.algorithms,
    icon: <Image src={Algorithms} alt="algorithms" />,
  },
  {
    name: "a_b_testing",
    title: "A/B Testing",
    content: skillStrings.abTesting,
    icon: <Image src={ABTesting} alt="a_b_testing" />,
  },
  {
    name: "sql",
    title: "SQL",
    content: skillStrings.sql,
    icon: <Image src={SQL} alt="sql" />,
  },
  {
    name: "system_design",
    title: "System Design",
    content: skillStrings.systemDesign,
    icon: <Image src={SystemDesign} alt="system_design" />,
  },
  {
    name: "testing",
    title: "Testing",
    content: skillStrings.testing,
    icon: <Image src={Testing} alt="testing" />,
  },
];

export const experience = [
  {
    color: "#ffe11b",
    type: "work",
    date: experienceStrings.surveymonkeyMLDate,
    title: experienceStrings.surveymonkeyMLTitle,
    location: experienceStrings.surveymonkeyMLLocation,
    tasks: experienceStrings.surveymonkeyMLTasks,
    skills: experienceStrings.surveymonkeyMLSkills,
  },
  {
    color: "#00BF6F",
    type: "work",
    date: experienceStrings.surveymonkeyGrowthDate,
    title: experienceStrings.surveymonkeyGrowthTitle,
    location: experienceStrings.surveymonkeyGrowthLocation,
    tasks: experienceStrings.surveymonkeyGrowthTasks,
    skills: experienceStrings.surveymonkeyGrowthSkills,
  },
  {
    color: "#daad58",
    type: "work",
    date: experienceStrings.exordoDate,
    title: experienceStrings.exordoTitle,
    location: experienceStrings.exordoLocation,
    tasks: experienceStrings.exordoTasks,
    skills: experienceStrings.exordoSkills,
  },
  {
    color: "#a34a88",
    type: "school",
    date: experienceStrings.nuigDate,
    title: experienceStrings.nuigTitle,
    location: experienceStrings.nuigLocation,
    tasks: experienceStrings.nuigTasks,
  },
  {
    color: "#253B80",
    type: "school",
    date: experienceStrings.yeatsDate,
    title: experienceStrings.yeatsTitle,
    location: experienceStrings.yeatsLocation,
    tasks: experienceStrings.yeatsTasks,
  },
];

export const fadeDuration = 300;

export const SPOTIFY_PLAYLISTS = [
  "https://open.spotify.com/playlist/37i9dQZF1EpAh9wBJPJbF3",
  "https://open.spotify.com/playlist/4Jb4PDWREzNnbZcOHPcZPy",
];

export const WIDGET_HEIGHT = 450;

export const TRANSITION_DURATION = 300;

export const IMAGE_TRANSITION_DURATION = 0.65;

export const COLORS = {
  white: "#fff",
  black: "#000",
  blue: "#5674fe",
  purple: "#8d39ea",
  grey: "#f1f1f1",
  darkBlue: "#556cd6",
  darkGrey: "#888888",
  lightBlue: "#2194f3",
  mediumGrey: "#a5a5a5",
  red: "#d92e3c",
  orange: "#eb9a0e",
  green: "#29941f",
  polyline: "#ff2527",
};

export const POLYLINE_OPACITY = 0.75;

export const POLYLINE_WEIGHT = 2;

export const FORMSPREE_URL = "https://formspree.io";

export const SUMMARY_PIE_POSITION = 70;

export const SUMMARY_PIE_ANGLE = 18;

export const SUMMARY_PIE_LINE_WIDTH = 20;

export const SUMMARY_PIE_RADIUS = 30;
