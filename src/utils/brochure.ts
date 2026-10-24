export const BROCHURE_URL = "/nevas-brochure.pdf"; // Put your PDF in the public folder with this name

export const openBrochurePopup = () => {
  window.dispatchEvent(new Event("open-brochure-popup"));
};