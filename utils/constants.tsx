import Image from "next/image";
import AI from "../public/static/assets/icons/ai.svg";
import Python from "../public/static/assets/icons/python.svg";
import Javascript from "../public/static/assets/icons/javascript.svg";
import WebDev from "../public/static/assets/icons/web_dev.svg";
import Cloud from "../public/static/assets/icons/cloud.svg";
import Infrastructure from "../public/static/assets/icons/infrastructure.svg";
import Git from "../public/static/assets/icons/git.svg";
import Algorithms from "../public/static/assets/icons/algorithms.svg";
import ABTesting from "../public/static/assets/icons/a_b_testing.svg";
import SQL from "../public/static/assets/icons/sql.svg";
import SystemDesign from "../public/static/assets/icons/system_design.svg";
import Testing from "../public/static/assets/icons/testing.svg";
import { skillStrings, experienceStrings } from "./strings";
import type { FeaturedPlaylist } from "./types";

export const PAGES = ["home", "about", "experience", "contact"];

const DESKTOP =
  "https://hurley-site-images.s3-eu-west-1.amazonaws.com/minified_new/desktop/";

// Hero carousel manifest. Replaces the two bare id arrays (BACKGROUNDS /
// MOBILE_BACKGROUNDS), which carried no alt text and no locations.
//
// IMPORTANT: these describe the DESKTOP bucket, which is what the carousel
// renders. An earlier version described the mobile bucket by mistake - the two
// are unrelated photo sets, not crops of the same shots, so every location was
// wrong. `mobileSrc` is therefore NOT set: pairing them would put one photo's
// caption on a different photo.
//
// Alt text is written from the photographs themselves. Locations marked
// (unconfirmed) are my best read and need James to correct them.
export const HERO_IMAGES = [
  {
    id: "first",
    alt: "Standing on the edge of Table Mountain looking down over Table Bay and the city of Cape Town at dusk",
    location: "Table Mountain, Cape Town",
    coords: "33.9628\u00b0S  18.4098\u00b0E",
    desktopSrc: "/static/assets/images/first_image.webp",
  },
  {
    id: "one",
    alt: "On the sea wall at sunset, with the Pacific on one side and cliff-top apartment blocks running along the shoreline",
    location: "Miraflores, Lima",
    coords: "12.1219\u00b0S  77.0297\u00b0W",
    desktopSrc: `${DESKTOP}one.jpg`,
  },
  {
    id: "two",
    alt: "On a volcano summit ridge with three of us shoulder to shoulder and a steam plume rising behind",
    location: "Volcano summit, Andes",
    coords: "16.2940\u00b0S  71.4090\u00b0W",
    desktopSrc: `${DESKTOP}two.jpg`,
  },
  {
    id: "three",
    alt: "Beside a pale turquoise altiplano lagoon ringed by salt flats, with snow-capped volcanoes on the far shore",
    location: "Altiplano lagoon, Bolivia",
    coords: "22.5000\u00b0S  67.8000\u00b0W",
    desktopSrc: `${DESKTOP}three.jpg`,
  },
  {
    id: "four",
    alt: "Leaning on the stone wall at Cape Point beside the plaque marking the remains of a secret 1943 radar station, open ocean behind",
    location: "Cape Point, South Africa",
    coords: "34.3568\u00b0S  18.4970\u00b0E",
    desktopSrc: `${DESKTOP}four.jpg`,
  },
  {
    id: "five",
    alt: "On a restaurant balcony above the bay, mountains falling away to the water on both sides",
    location: "Cape Peninsula, South Africa",
    coords: "34.0500\u00b0S  18.3500\u00b0E",
    desktopSrc: `${DESKTOP}five.jpg`,
  },
  {
    id: "six",
    alt: "Above the closing hole at Pebble Beach, the fairway running down to the Pacific under low cloud",
    location: "Pebble Beach, California",
    coords: "36.5680\u00b0N 121.9500\u00b0W",
    desktopSrc: `${DESKTOP}six.jpg`,
  },
  {
    id: "seven",
    alt: "Standing on a railway line running dead straight across a salt flat, volcanoes on the horizon",
    location: "Salar de Uyuni, Bolivia",
    coords: "20.5000\u00b0S  67.5000\u00b0W",
    desktopSrc: `${DESKTOP}seven.jpg`,
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

export const DARK_MAP_STYLES = [
  {
    elementType: "geometry",
    stylers: [{ color: "#172126" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#BFC8CA" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#172126" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#213035" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2B373B" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#BFC8CA" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#2F5D57" }],
  },
];

// Ordered most to least current, so the first row carries what I actually work
// with day to day. Java (Eclipse), Ruby, Backbone and Android were dropped -
// they were accurate in 2018 and hadn't been touched since. Ruby still appears
// in the Ex Ordo timeline entry, which is where dated experience belongs.
export const SKILLS = [
  {
    name: "ai",
    title: "AI & LLM Engineering",
    content: skillStrings.ai,
    icon: <Image src={AI} alt="ai" />,
  },
  {
    name: "python",
    title: "Python",
    content: skillStrings.python,
    icon: <Image src={Python} alt="python" />,
  },
  {
    name: "typescript",
    title: "TypeScript",
    content: skillStrings.typescript,
    icon: <Image src={Javascript} alt="typescript" />,
  },
  {
    name: "cloud",
    title: "Cloud & Serverless",
    content: skillStrings.cloud,
    icon: <Image src={Cloud} alt="cloud" />,
  },
  {
    name: "infrastructure",
    title: "Infrastructure & CI/CD",
    content: skillStrings.infrastructure,
    icon: <Image src={Infrastructure} alt="infrastructure" />,
  },
  {
    name: "system_design",
    title: "System Design",
    content: skillStrings.systemDesign,
    icon: <Image src={SystemDesign} alt="system_design" />,
  },
  {
    name: "web_development",
    title: "Web Development",
    content: skillStrings.webDevelopment,
    icon: <Image src={WebDev} alt="web_development" />,
  },
  {
    name: "databases",
    title: "Databases",
    content: skillStrings.databases,
    icon: <Image src={SQL} alt="databases" />,
  },
  {
    name: "testing",
    title: "Testing",
    content: skillStrings.testing,
    icon: <Image src={Testing} alt="testing" />,
  },
  {
    name: "git",
    title: "Git",
    content: skillStrings.git,
    icon: <Image src={Git} alt="git" />,
  },
  {
    name: "a_b_testing",
    title: "A/B Testing",
    content: skillStrings.abTesting,
    icon: <Image src={ABTesting} alt="a_b_testing" />,
  },
  {
    name: "algorithms",
    title: "Algorithms & Data Structures",
    content: skillStrings.algorithms,
    icon: <Image src={Algorithms} alt="algorithms" />,
  },
];

export const CAPABILITY_GROUPS = [
  {
    title: "AI & ML",
    icon: SKILLS[0].icon,
    skills: [SKILLS[0], SKILLS[1]],
  },
  {
    title: "Product Engineering",
    icon: SKILLS[2].icon,
    skills: [SKILLS[2], SKILLS[6], SKILLS[10]],
  },
  {
    title: "Systems",
    icon: SKILLS[3].icon,
    skills: [SKILLS[3], SKILLS[4], SKILLS[5], SKILLS[7]],
  },
  {
    title: "Engineering Craft",
    icon: SKILLS[8].icon,
    skills: [SKILLS[8], SKILLS[9], SKILLS[11]],
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

export const FEATURED_PLAYLIST: FeaturedPlaylist = {
  href: "https://open.spotify.com/playlist/37i9dQZF1EpAh9wBJPJbF3",
  label: "Current rotation",
  title: "A soundtrack for the road",
  description: "A selection of what I have been listening to lately.",
};

export const WIDGET_HEIGHT = 352;

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
