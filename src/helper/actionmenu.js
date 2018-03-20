/**
 *  Created by BoGao on 2018-03-14;
 */


const getRootTop = (menuID) => {
  const id = `${menuID}_ROOT`;
  const treeNode = document.getElementById(id);
  if (treeNode) {
    return treeNode.offsetTop;
  }
  return 0; // TODO 猜一个.
};

const getElementTop = (element) => {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
};

const createMenu = (menuID) => {
  const rootTop = getRootTop(menuID);

  const menuElm = document.getElementById(menuID);
  if (!menuElm) {
    // console.error(`can't find element ${menuID}`);
  }
  return {
    menuElm, rootTop,

    show: function (target, data) {
      this.rootTop = getRootTop(menuID);
      this.menuElm = document.getElementById(menuID);
      const top = getElementTop(target) - this.rootTop - 28;

      // console.log('menu is ', this, target, getElementTop(target), this.rootTop, top);
      if (this.menuElm) {
        console.log('top is ', top);
        this.menuElm.style.top = `${top}px`;
        this.menuElm.firstElementChild.style.visibility = 'visible';
        // console.log('this.menuElm.firstElementChild.style.visibility:',
        //   this.menuElm.firstElementChild.style.visibility);
        // this.menuElm.style.visibility = 'visible';
        // this.menuElm.style.display = 'block';
        this.menuElm.dataset.item = JSON.stringify(data);
      }
    },
  };
};

const init = (menuID) => {
  return createMenu(menuID)
};

export default { init }
