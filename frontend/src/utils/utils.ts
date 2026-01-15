export const formatDate = (dateString: string) => {
  return dateString.split("T")[0];
};

export const excerpt = (content: string, maxLength: number = 100) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};
