export const randomIntFromInterval = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const saveSvg = (svgEl: string, name: string): boolean => {
  const svg = document.querySelector(svgEl);

  if (svg) {
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = svg.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return true;
  }

  return false;
};
