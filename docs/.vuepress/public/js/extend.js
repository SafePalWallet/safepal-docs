window.onload = function () {
  var links = document.querySelectorAll('.nav-link');
  var linkArr = Array.prototype.slice.call(links);
  linkArr.forEach((element) => {
    if (element.href == 'https://safepal.com/') {
      element.setAttribute(
        'title',
        'Managing Your Assets Just Got Easier.'
      );
    }
  });

  if (location.href.indexOf('how-to-connect') > -1) {
    location.href = location.href.replace(
      'how-to-connect',
      'connect-wallet-for-dapp'
    );
  }


};
