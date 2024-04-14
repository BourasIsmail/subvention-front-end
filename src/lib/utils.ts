import { type ClassValue, clsx } from "clsx"
import html2canvas from "html2canvas";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function TakeScreentShot(elementId: string, name: string, type: string) {
  let element = document.getElementById(elementId) as HTMLElement;
  html2canvas(element).then((canvas) => {
    let image = canvas.toDataURL(type);
    const a = document.createElement('a');
    a.href = image;
    a.download = name;
    a.click();
  }
  ).catch((error) => {
    console.log(error)
  });
}