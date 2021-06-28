const utils = {
  // méthode qui ferme toutes les modales d'un coup
  hideModals: () => {
    const allModals = document.querySelectorAll('.modal');
    for (const modal of allModals) {
      modal.classList.remove('is-active');
    }
  },

  base_url: 'http://100.26.151.183:3000/api',
};

module.exports = utils;

