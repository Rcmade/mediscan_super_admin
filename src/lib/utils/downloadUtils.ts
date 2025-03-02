export const downloadFromLink = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => {
  fetch(link)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}_image.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => console.error("Error downloading image:", error));
};
