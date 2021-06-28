const utils = {
  // méthode qui ferme toutes les modales d'un coup
  hideModals: () => {
    const allModals = document.querySelectorAll('.modal');
    for (const modal of allModals) {
      modal.classList.remove('is-active');
    }
  },

  base_url: 'http://localhost:3000/api',
};

module.exports = utils;

