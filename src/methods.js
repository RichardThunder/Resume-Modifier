export const scoreToColors = (score) => {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  // 定义各个颜色的 RGB 值
  const deepRed = {r: 139, g: 0, b: 0};       // 深红色
  const red = {r: 255, g: 0, b: 0};           // 红色
  const yellow = {r: 255, g: 255, b: 0};      // 黄色
  const lightGreen = {r: 0, g: 255, b: 0};    // 浅绿色
  const deepGreen = {r: 0, g: 100, b: 0};     // 深绿色

  let redVal, greenVal, blueVal;

  // 映射分为 4 个区间：0-25、25-50、50-75、75-100
  if (score <= 25) {
    // 从深红色到红色
    redVal = Math.round(deepRed.r + (red.r - deepRed.r) * (score / 25));
    greenVal = Math.round(deepRed.g + (red.g - deepRed.g) * (score / 25));
    blueVal = Math.round(deepRed.b + (red.b - deepRed.b) * (score / 25));
  } else if (score <= 50) {
    // 从红色到黄色
    const adjustedScore = score - 25; // 将区间缩小到 [0, 25]
    redVal = Math.round(red.r + (yellow.r - red.r) * (adjustedScore / 25));
    greenVal = Math.round(red.g + (yellow.g - red.g) * (adjustedScore / 25));
    blueVal = Math.round(red.b + (yellow.b - red.b) * (adjustedScore / 25));
  } else if (score <= 75) {
    // 从黄色到浅绿色
    const adjustedScore = score - 50; // 将区间缩小到 [0, 25]
    redVal = Math.round(yellow.r + (lightGreen.r - yellow.r) * (adjustedScore / 25));
    greenVal = Math.round(yellow.g + (lightGreen.g - yellow.g) * (adjustedScore / 25));
    blueVal = Math.round(yellow.b + (lightGreen.b - yellow.b) * (adjustedScore / 25));
  } else {
    // 从浅绿色到深绿色
    const adjustedScore = score - 75; // 将区间缩小到 [0, 25]
    redVal = Math.round(lightGreen.r + (deepGreen.r - lightGreen.r) * (adjustedScore / 25));
    greenVal = Math.round(lightGreen.g + (deepGreen.g - lightGreen.g) * (adjustedScore / 25));
    blueVal = Math.round(lightGreen.b + (deepGreen.b - lightGreen.b) * (adjustedScore / 25));
  }
  // 返回 RGB 颜色字符串
  return `rgb(${redVal}, ${greenVal}, ${blueVal})`;
};

export const textToHtml = (text) => {
  if (text.length === 0) return null;
  const li = text.split('•').map(item => item.trim()).filter(item => item.length > 0).map(item => `<li>` + item + `</li>`).join(' ');
  return `<ul>` + li + `</ul>`;
};

export const htmlToPlainText = (html) => {
  if (html === '') return null;
  return html.replace(/<ul>|<\/ul>/g, '')
      .replace(/<li>/g, '• ')
      .replace(/<\/li>/g, ' ')
      .trim();
};

export const convertModel = (item, callback) => {
  item.education.forEach((edu) => {
    if (edu.description && typeof edu.description === 'string')
      edu.description = callback(edu.description);
  });
  item.project.forEach((project) => {
    if (project.description && typeof project.description === 'string')
      project.description = callback(project.description);
  });
  item.summary=callback(item.summary);
  item.publications.forEach((pub) => {
    if (pub.description && typeof pub.description === 'string')
      pub.description = callback(pub.description);
  });
  item.references.forEach((ref) => {
    if (ref.description && typeof ref.description === 'string')
      ref.description = callback(ref.description);
  });
  item.volunteering.forEach((vol) => {
    if (vol.description && typeof vol.description === 'string')
      vol.description = callback(vol.description);
  });
  item.workExperience.forEach((exp) => {
    if (exp.description && typeof exp.description === 'string')
      exp.description = callback(exp.description);
  });

};
