// letters.js
// Put your image files inside ./photos/ (examples: us1.jpg, us2.jpg, us3.jpg,...)

export const letters = [
  {
    id: 1,
    day: 1,
    title: "im sorry",
    content: `hi baby, im sorry but i hope you can trust me on this one. i promise i'll work on it and be of your help instead of making things worse for you.`,
    color: "gradient-1",
    secretType: "puzzle" // puzzle | memory | password
  },
  {
    id: 2,
    day: 2,
    title: "mwah",
    content: `this is to remind you that i love you so much and that no matter what happens, i'll always be here for you. please take care of yourself, okay?`,
    color: "gradient-2",
    secretType: "puzzle"
  },
  {
    id: 3,
    day: 3,
    title: "open if you'll say yes",
    content: `https://drive.google.com/file/d/1MQcttohuxk1HHZ69H7Vwb_M-hIwYyCKw/view?usp=drive_link`,
    color: "gradient-3",
    secretType: "puzzle",
    link: "https://drive.google.com/file/d/1MQcttohuxk1HHZ69H7Vwb_M-hIwYyCKw/view?usp=drive_link"
  }
  // Add more secret objects if you want
];

export const gallery = [
  { id: 'us1', src: './photos/photo1.jpg', alt: 'Us 1', caption: '31/07/2025 :)' },
  { id: 'us2', src: './photos/photo2.jpg', alt: 'Us 2', caption: 'this day>>' },
  { id: 'us3', src: './photos/photo3.jpg', alt: 'Us 3', caption: 'best birthday gift ever<3' },
  { id: 'us4', src: './photos/photo4.jpg', alt: 'Us 4', caption: 'prettiest✋' },
  { id: 'us5', src: './photos/photo5.jpg', alt: 'Us 5', caption: 'R.I.P.🕊️' }
  // Add more images and matching files in the photos/ folder
];

export const wordPuzzles = {
  1: { word: "MAGGI", hint: "our go to snack" },
  2: { word: "CHOTI", hint: "nbc is incomplete without" },
  3: { word: "ROADS", hint: "im glad we crossed" }
};
