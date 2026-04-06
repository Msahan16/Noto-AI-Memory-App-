export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const trimText = (text: string, max = 120): string => {
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}...`;
};
