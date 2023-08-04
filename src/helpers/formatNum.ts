export const zeroPad = (numberInput: number | string) => {
  if (typeof numberInput === "number") {
    return numberInput.toString().padStart(2, "0");
  }
  return numberInput.padStart(2, "0");
};
