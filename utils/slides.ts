import InputButton from "../screens/components/input/IntroHomeCountryButton";

export interface ImageSlide {
  key: string;
  image: any; // Using `any` here because the `require()` function doesn't have a specific return type we can reference. Consider replacing `any` with a more specific type if you can provide one.
}

type ComponentSlide = {
  key: string;
  component: React.ComponentType;
};

export type Slide = ImageSlide | ComponentSlide;

export const slides: Slide[] = [
  {
    key: "zero",
    component: InputButton,
  },
  {
    key: "one",
    image: require("../assets/1.png"),
  },
  {
    key: "two",
    image: require("../assets/2.png"),
  },
  {
    key: "three",
    image: require("../assets/3.png"),
  },
  {
    key: "four",
    image: require("../assets/4.png"),
  },
  {
    key: "five",
    image: require("../assets/5.png"),
  },
];
