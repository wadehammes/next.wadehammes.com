import { SPIRALS_CONSTANTS } from "src/components/Spirals/Spirals.utils";

export const randomIntFromInterval = (min: number, max: number): number => {
  const minFloor = Math.floor(min);
  const maxCeil = Math.ceil(max);

  return Math.floor(Math.random() * (maxCeil - minFloor + 1) + minFloor);
};

export const randomDecFromInterval = (min: number, max: number): number => {
  const number: number = Math.random() * (max - min) + min;

  return Number(number.toFixed(4));
};

const mergeFractalStackForExport = (
  stack: HTMLElement,
): SVGSVGElement | null => {
  const layers = [...stack.querySelectorAll("svg.fractal-layer")];
  if (layers.length === 0) {
    return null;
  }

  const merged = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  merged.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  merged.setAttribute(
    "viewBox",
    `0 0 ${SPIRALS_CONSTANTS.VIEWBOX} ${SPIRALS_CONSTANTS.VIEWBOX}`,
  );
  merged.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const bg = stack.style.backgroundColor;
  if (bg) {
    merged.style.backgroundColor = bg;
  }

  for (const layer of layers) {
    const setRoot = layer.querySelector(":scope > g");
    if (!setRoot) {
      continue;
    }

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    for (const child of setRoot.childNodes) {
      group.appendChild(child.cloneNode(true));
    }
    merged.appendChild(group);
  }

  return merged;
};

export const saveSvg = (svgEl: string, name: string): boolean => {
  const target = document.querySelector(svgEl);
  const svg =
    target instanceof SVGSVGElement
      ? target
      : target instanceof HTMLElement && target.dataset.fractalStack === "true"
        ? mergeFractalStackForExport(target)
        : null;

  if (svg && name) {
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
    downloadLink.target = "_blank";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    setTimeout(() => {
      try {
        if (downloadLink.parentNode) {
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(svgUrl);
      } catch (error) {
        console.warn("Error cleaning up download link:", error);
      }
    }, 100);

    return true;
  }

  return false;
};
