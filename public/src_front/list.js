// const cardModule = require('./card')
// const utils = require('./utils')

const listModule = {
  // méthode qui ouvre la modale "nouvelle liste"
  showAddListModal: () => {
    const newListModal = document.getElementById('addListModal');
    newListModal.classList.add('is-active');
  },

  // listener "soumission du formulaire ajout d'une liste"
  handleAddListForm: async (event) => {
    event.preventDefault();
    // event est un evenement submit
    // donc event.target est toujours le formulaire

    // on utilise FormData : on peut lui passer directement un element HTML qui est un formulaire
    // il va tout seul, comme un grand, récupérer les valeurs de tous les inputs du formulaire (et paf, on a tout dans un objet bien rangé)
    const data = new FormData(event.target);

    // quoi? y'a rien ? non, c'est un piège
    // en fait FormData est une classe dont toutes les propriétés sont privées (il est interdit d'y accéder directement)
    // l'astuce pour tout afficher, c'est Array.from, ou Object.fromEntries
    // console.log(Object.fromEntries(data));

    // fermer les modales
    utils.hideModals();

    // ICI il faudra penser à envoyer une requete à l'API
    // pour créer réellement la liste côté back
    // on n'ajoutera les elements HTML que quand l'api aura répondu

    // app.makeListInDOM(data);

    const response = await fetch(utils.base_url + '/list', {
      method: 'POST',
      body: data,
    });

    const newList = await response.json();

    listModule.makeListInDOM(newList);
  },

  // méthode pour ajouter une nouvelle liste dans le DOM
  makeListInDOM: (data) => {
    // 1. créer un clone du template de liste
    const templateSource = document.getElementById('newListTemplate');
    const newList = document.importNode(templateSource.content, true);

    // 2. remplacer certains éléments du nouveau clone par des données qui viennent de data
    const newListTitle = newList.querySelector('h2');
    newListTitle.textContent = data.name;
    // 2bis. remplacer data-list-id par l'id réel de la liste (depuis la bdd)
    newList.querySelector('[data-list-id]').dataset.listId = data.id;

    // 2bisbis. on en profite aussi pour ajouter des eventListener dans le clone
    const addCardButtonInNewClone = newList.querySelector('.addCardButton');
    addCardButtonInNewClone.addEventListener(
      'click',
      cardModule.showAddCardModal
    );

    const deleteListBtn = newList.querySelector('.deleteListBtn');
    deleteListBtn.addEventListener('click', listModule.deleteList);

    newListTitle.addEventListener('dblclick', listModule.showEditListForm);


    const cardsContainer = newList.querySelector('.cardsContainer')

    new Sortable(cardsContainer, {
      group: 'shared',
      onEnd: cardModule.handleDropCard,
      animation: 150,
    });
    // 3. ajouter le nouveau clone au bon endroit dans le DOM
    document.getElementById('lastColumn').before(newList);
  },

  showEditListForm: (e) => {
    const currentListTitle = e.target;
    const currentList = currentListTitle.closest('.panel');
    const editListTitleForm = currentList.querySelector('.editListTitle');

    const inputHidden = currentList.querySelector('input[type="hidden"]');
    inputHidden.value = currentList.dataset.listId;

    currentListTitle.classList.toggle('is-hidden');
    editListTitleForm.classList.toggle('is-hidden');

    const cancelEditForm = (e) => {
      // console.log(e.target.tagName);
      switch (e.target.tagName) {
        case 'SECTION':
        case 'DIV':
        case 'H1':
          currentListTitle.classList.remove('is-hidden');
          editListTitleForm.classList.add('is-hidden');
          window.removeEventListener('click', cancelEditForm);
          break;

        default:
          break;
      }
    };

    window.addEventListener('click', cancelEditForm);

    editListTitleForm.addEventListener(
      'submit',
      listModule.handleEditTitleForm
    );
  },

  handleEditTitleForm: async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const currentListId = data.get('list-id');

    const response = await fetch(utils.base_url + `/list/${currentListId}`, {
      method: 'PATCH',
      body: data,
    });

    const currentList = document.querySelector(
      `[data-list-id="${currentListId}"]`
    );
    const currentListTitle = currentList.querySelector('h2');
    const editListTitleForm = currentList.querySelector('form');

    const updatedList = await response.json();

    currentListTitle.textContent = updatedList.name;
    currentListTitle.classList.toggle('is-hidden');
    editListTitleForm.classList.toggle('is-hidden');
  },

  deleteList: async (e) => {
    try {
      const currentList = e.currentTarget.closest('.panel');
      const listId = currentList.dataset.listId;

      if (currentList.querySelector('.box')) {
        throw 'La liste ne doit pas contenir de carte pour être supprimé';
      }

      const response = await fetch(utils.base_url + `/list/${listId}`, {
        method: 'DELETE',
      });

      const check = await response.json();

      if (check) {
        currentList.remove();
      }
    } catch (error) {
      alert(error);
    }
  },

  handleDropCard: (e) => {
    
  }
};



// module.exports = listModule
