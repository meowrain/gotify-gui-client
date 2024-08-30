const { Menu } = require("electron");
const template = [
  {
    label: "\u4E3B\u9801"
  },
  {
    label: "\u8A2D\u7F6E"
  }
];
const myMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(myMenu);
