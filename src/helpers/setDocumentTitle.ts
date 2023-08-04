const PAGE_TITLE_PREFIX = "ParioPad";
export const setDocumentTitle = (title: string, prefix?: string) => {
  let newTitle;
  if (title === "/") {
    newTitle = " ";
  } else {
    newTitle = title.replaceAll("/", " | ");
  }
  return (document.title = [prefix || PAGE_TITLE_PREFIX, newTitle].join(" "));
};
