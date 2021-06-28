const utils = require('./utils')
const listModule = require('./list')
const cardModule = require('./card')
const labelModule = require('./label')
const Sortable = require('sortablejs')

// on objet qui contient des fonctions
const app = {
  // méthode qui ajoute des listeners sur les boutons importants
  addListenerToActions: () => {
    /** interactin modale "nouvelle liste" */
    // 1. récupérer le bouton, sur lequel on devra cliquer
    const openAddListModalButton = document.getElementById('addListButton');
    // 2. brancher une fonction sur le click de ce bouton
    openAddListModalButton.addEventListener(
      'click',
      listModule.showAddListModal
    );

    /** interaction fermer les modales */
    // 1. récupérer TOUS les boutons ayant la classe "close"
    const closeModalsButtons = document.querySelectorAll('.modal .close');
    // 2. ajouter un eventListener sur chacun de ces boutons.
    for (const closeButton of closeModalsButtons) {
      closeButton.addEventListener('click', utils.hideModals);
    }

    /** soumission du formulaire "nouvelle liste" */
    const addListForm = document.getElementById('addListForm');
    addListForm.addEventListener('submit', listModule.handleAddListForm);

    /** interaction modale "nouvelle carte" */
    const addCardButtons = document.querySelectorAll('.addCardButton');
    for (const button of addCardButtons) {
      button.addEventListener('click', cardModule.showAddCardModal);
    }

    /** soumission du formulaire "nouvelle carte" */
    const addCardForm = document.getElementById('addCardForm');
    addCardForm.addEventListener('submit', cardModule.handleAddCardForm);

    /** montrer la modal pour ajouter un label */
    const showAddLabelForm = document.getElementById('addLabelButton');
    showAddLabelForm.addEventListener('click', labelModule.showFormLabel);

    const showDeleteLabelForm = document.getElementById('deleteLabelButton');
    showDeleteLabelForm.addEventListener(
      'click',
      labelModule.showDeleteModalLabel
    );
    /** montrer la modal pour modifier un label */
    const showUpdateModale = document.getElementById('updateLabelButton');
    showUpdateModale.addEventListener('click', labelModule.showUpdateModal);

    /** event listener sur le submit */
    const labelModalForm = document.querySelector('#addLabelModal');
    labelModalForm.addEventListener('submit', labelModule.handleAddLabelForm);
  },

  getListsFromApi: async () => {
    try {
      const response = await fetch(utils.base_url + '/list', { method: 'GET' });
      const lists = await response.json();

      for (const list of lists) {
        listModule.makeListInDOM(list);
        for (const card of list.cards) {
          cardModule.makeCardInDOM(card);
          for (const label of card.labels) {
            labelModule.makeLabelInDOM(label);
          }
        }
      }

      labelModule.getLabelFromApi();
    } catch (error) {
      console.trace(error);
    }
  },

  handleDropList: (event) => {
    const allLists = document.querySelectorAll('[data-list-id]');

    allLists.forEach((list, index) => {
      listId = list.dataset.listId;

      const data = new FormData();
      data.set('position', index);

      fetch(utils.base_url + '/list/' + listId, {
        method: 'PATCH',
        body: data,
      });
    });
  },

  // fonction d'initialisation, lancée au chargement de la page
  init: () => {
    const listContainer = document.querySelector('.listContainer');

    new Sortable(listContainer, {
      onEnd: app.handleDropList,
      animation: 300,
    });

    app.getListsFromApi();

    app.addListenerToActions();
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);