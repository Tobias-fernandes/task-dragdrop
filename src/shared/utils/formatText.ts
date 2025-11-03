const formatText = (text: string, maxLength: number = 20): string => {
  const textWithoutSpace = text.replaceAll(" ", "");
  if (textWithoutSpace.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export { formatText };
