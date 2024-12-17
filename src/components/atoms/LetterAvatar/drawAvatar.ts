export const makeLetterAvatar = (name: any, size: any, canvas: any) => {
  name = name || '';
  size = size || 24;

  const colours = [
      '#1abc9c',
      '#2ecc71',
      '#3498db',
      '#9b59b6',
      '#34495e',
      '#16a085',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
      '#2c3e50',
      '#f1c40f',
      '#e67e22',
      '#e74c3c',
      '#ecf0f1',
      '#95a5a6',
      '#f39c12',
      '#d35400',
      '#c0392b',
      '#bdc3c7',
      '#7f8c8d',
    ],
    nameSplit = String(name).toUpperCase().split(' ');
  let initials;

  if (nameSplit.length == 1) {
    initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
  } else {
    initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
  }

  const charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
  const colourIndex = charIndex % 20;
  const context = canvas.getContext('2d');
  const styleHeight = +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
  const styleWidth = +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
  const dpi = window.devicePixelRatio;

  canvas.setAttribute('height', styleHeight * dpi);
  canvas.setAttribute('width', styleWidth * dpi);

  context.fillStyle = colours[colourIndex - 1];
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = `${canvas.width / 2}px arial`;
  context.textAlign = 'center';
  context.fillStyle = '#FFF';
  context.fillText(initials, (size * (styleHeight / 24) * dpi) / 2, (size * 1.35 * (styleHeight / 24) * dpi) / 2);

  return canvas.toDataURL();
};
