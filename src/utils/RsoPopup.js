export const openRsoPopup = () => {
  const width = 500;
  const height = 720;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
  const features = [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
  const popup = window.open("about:blank", "teamgg-riot-rso", features);
  if (!popup) throw new Error("Riot 로그인 팝업을 허용해주세요.");
  popup.opener = null;
  popup.focus();
  return popup;
};
