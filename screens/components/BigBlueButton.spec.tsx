import { render, fireEvent } from "@testing-library/react-native";
import BigBlueButton from "./BigBlueButton";

describe("BigBlueButton", () => {
  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <BigBlueButton onPress={onPress} isActive text="SAVE" />
    );
    fireEvent.press(getByText("SAVE"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
