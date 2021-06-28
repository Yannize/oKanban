(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const utils = require('./utils')
const listModule = require('./list')
const cardModule = require('./card')
const labelModule = require('./label')
// const Sortable = require('sortablejs')

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
},{"./card":2,"./label":3,"./list":4,"./utils":5}],2:[function(require,module,exports){
const utils = require('./utils')
const labelModule = require('./label')

const cardModule = {
  // méthode pour afficher la modale "ajouter une carte"
  showAddCardModal: (event) => {
    const parentList = event.target.closest('[data-list-id]');
    const targetListId = parentList.dataset.listId;
    // rq: la ligne précédente est STRICTEMENT équivalente à:
    //const targetListId = parentList.getAttribute('data-list-id');

    // il faut insérer l'id de la liste dans l'input hidden du formulaire
    document.querySelector('#addCardForm input[name="list_id"]').value =
      targetListId;

    const newCardModal = document.getElementById('addCardModal');
    newCardModal.classList.add('is-active');
  },

  // méthode qui capture la soumission du formulaire "ajout d'une carte"
  handleAddCardForm: async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    // ICI on rajoutera un appel POST à l'API
    const response = await fetch(utils.base_url + '/card', {
      method: 'POST',
      body: data,
    });

    utils.hideModals();

    const newList = await response.json();

    cardModule.makeCardInDOM(newList);
  },

  // méthode pour ajouter une carte dans le DOM
  makeCardInDOM: (data) => {
    // 1. créer un clone du template de liste
    const templateSource = document.getElementById('newCardTemplate');
    const newCard = document.importNode(templateSource.content, true);

    // 2. modifier les valeurs nécessaires

    // 2.a ajouter le text de la carte
    newCard.querySelector('.cardContent h3').textContent = data.text;

    // 2.b ajouter la couleur de la carte
    newCard.querySelector('.box').style.backgroundColor = data.color;

    // 2.c ajouter l'id de la carte
    newCard.querySelector('.box').dataset.cardId = data.id;

    // listener sur le bouton éditer une carte
    newCard
      .querySelector('.editCardBtn')
      .addEventListener('click', cardModule.showEditCardForm);

    // listener sur le bouton supprimer une carte
    newCard
      .querySelector('.deleteCardBtn')
      .addEventListener('click', cardModule.showDeteleModal);

    // listener click droit sur carte pour afficher la liste des label
    newCard
      .querySelector('.box')
      .addEventListener('contextmenu', labelModule.showLabelMenu);

    // listener sur le bouton créer un nouveau label  
    const createNewLabelOption = newCard.querySelector('.create');
    createNewLabelOption.addEventListener('click', labelModule.showFormLabel);

    const dropdownMenu = newCard.querySelector('.dropdown-content');
    const optionLabelTemplate = document.querySelector(
      '.dropdownLabelTemplate'
      );

      for (const option of labelModule.labelList) {
        if (!dropdownMenu.querySelector(`[id="${option.name}"]`)) {
          const clonedOption = document
          .importNode(optionLabelTemplate.content, true)
          .querySelector('a');
          
          clonedOption.textContent = option.name;
          clonedOption.id = option.name;
          
        clonedOption.addEventListener('click', labelModule.addTagToCard);

        dropdownMenu.prepend(clonedOption);
      }
    }


    


    // 3. insérer le nouveau clone au bon endroit dans le DOM
    const targetListId = data.list_id;
    document
      .querySelector(`[data-list-id="${targetListId}"] .cardsContainer`)
      .prepend(newCard);
  },

  currentCard: null,

  showDeteleModal: (e) => {
    cardModule.currentCard = e.currentTarget.closest('[data-card-id]');

    document.querySelector('#deleteCardModal').classList.toggle('is-active');
    document
      .querySelector('#deleteCardModal .button#deleteCardConfirm')
      .addEventListener('click', cardModule.deleteCard);
  },

  deleteCard: async () => {
    const cardId = cardModule.currentCard.dataset.cardId;
    const response = await fetch(utils.base_url + `/card/${cardId}`, {
      method: 'DELETE',
    });
    const check = await response.json();
    cardModule.currentCard.parentNode.remove();
    document.querySelector('#deleteCardModal').classList.toggle('is-active');
    document
      .querySelector('#deleteCardModal .button#deleteCardConfirm')
      .removeEventListener('click', cardModule.deleteCard);
  },

  currentCardText: null,

  showEditCardForm: (e) => {
    e.stopPropagation();
    const currentCard = e.currentTarget.closest('.cardContainer');

    const card = currentCard.querySelector('.box.card');
    const editCardForm = currentCard.querySelector('.box.cardEditForm');

    card.classList.add('is-hidden');
    editCardForm.classList.remove('is-hidden');

    editCardForm.querySelector('input[type="hidden"]').value =
      card.dataset.cardId;

    currentCard
      .closest('.cardContainer')
      .querySelector('.cardEditForm input[type="color"]').value = '#ff00ff';

    editCardForm.querySelector('textarea').value =
      currentCard.querySelector('h3').textContent;
    // console.log(editCardForm);

    const closeEditForm = (e) => {
      card.classList.remove('is-hidden');
      editCardForm.classList.add('is-hidden');
      editCardForm
        .querySelector('.close')
        .removeEventListener('click', closeEditForm);
    };

    editCardForm
      .querySelector('.close')
      .addEventListener('click', closeEditForm);

    editCardForm.addEventListener('submit', cardModule.handleEditCardForm);
  },

  handleEditCardForm: async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const cardId = data.get('card_id');

    // if (data.get('text') === '') {
    //   data.set('text', cardModule.currentCardText);
    // }

    const response = await fetch(utils.base_url + `/card/${cardId}`, {
      method: 'PATCH',
      body: data,
    });

    const newCard = await response.json();

    const currentCard = document.querySelector(`[data-card-id="${cardId}"]`);

    currentCard.querySelector('h3').textContent = newCard.text;
    currentCard.style.backgroundColor = newCard.color;

    currentCard.classList.remove('is-hidden');
    currentCard
      .closest('.cardContainer')
      .querySelector('.cardEditForm')
      .classList.add('is-hidden');
  },
};

module.exports = cardModule

},{"./label":3,"./utils":5}],3:[function(require,module,exports){
const utils = require('./utils')

const labelModule = {
  labelList: [],

  getLabelFromApi: async () => {
    const response = await fetch(utils.base_url + '/label', { method: 'GET' });
    const labels = await response.json();

    for (const label of labels) {
      labelModule.createNewLabel(label);
    }
  },

  addNewLabelToOption: (label) => {
    // get all label container in card
    const cards = document.querySelectorAll('.cardContainer');
    // get label option template
    const optionLabelTemplate = document.querySelector(
      '.dropdownLabelTemplate'
    );
    // in all cards container
    for (const card of cards) {
      // get drowpdown menu content
      const dropdownMenu = card.querySelector('.dropdown-content');

      // clone label option template
      const clonedOption = document
        .importNode(optionLabelTemplate.content, true)
        .querySelector('a');

      // add name and id of the new option
      clonedOption.textContent = label.name;
      clonedOption.id = label.name;
      clonedOption.style.color = label.color;
      // add listener on the new option for adding it on the card
      clonedOption.addEventListener('click', labelModule.addTagToCard);

      // preprend new option in the dropdown menu
      dropdownMenu.prepend(clonedOption);
    }
  },

  createNewLabel: (data) => {
    if (data !== null) {
      if (!labelModule.labelList.includes(data.name)) {
        labelModule.labelList.push(data);
      }
    }

    const cards = document.querySelectorAll('.cardContainer');
    const optionLabelTemplate = document.querySelector(
      '.dropdownLabelTemplate'
    );

    for (const card of cards) {
      const dropdownMenu = card.querySelector('.dropdown-content');

      for (const option of labelModule.labelList) {
        if (!dropdownMenu.querySelector(`[id="${option.name}"]`)) {
          const clonedOption = document
            .importNode(optionLabelTemplate.content, true)
            .querySelector('a');

          clonedOption.textContent = option.name;
          clonedOption.id = option.name;
          clonedOption.style.color = option.color;

          clonedOption.addEventListener('click', labelModule.addTagToCard);

          dropdownMenu.prepend(clonedOption);
        }
      }
    }
  },

  makeLabelInDOM: (data) => {
    const templateSource = document.querySelector('.labelTemplate');
    const clone = document.importNode(templateSource.content, true);

    const newLabel = clone.querySelector('.tag');

    const deleteLabelBtn = document.querySelector('#btnDeleteLabel');
    const cloneBtn = document.importNode(deleteLabelBtn.content, true);

    newLabel.textContent = data.name;
    newLabel.style.backgroundColor = data.color;

    newLabel.id = data.card_has_label.label_id;

    newLabel.dataset.labelOfCardId = data.card_has_label.card_id;

    newLabel.append(cloneBtn);

    const cardId = newLabel.dataset.labelOfCardId;

    const card = document.querySelector(`[data-card-id="${cardId}"]`);

    const labelContainer = card.querySelector('.cardContent');

    newLabel
      .querySelector('.delete')
      .addEventListener('click', labelModule.removeLabelFromCard);

    labelContainer.prepend(newLabel);
  },

  addTagToCard: async (e) => {
    try {
      const currentCard = e.target.closest('.box');
      const currentCardId = currentCard.dataset.cardId;
      const currentCardContent = currentCard.querySelector('.cardContent');

      for (label of labelModule.labelList) {
        if (!currentCardContent.querySelector(`[id="${label.id}"]`)) {
          if (e.target.id === label.name) {
            const response = await fetch(
              utils.base_url + `/card/${currentCardId}/label/${label.id}`,
              {
                method: 'POST',
              }
            );

            const association = await response.json();
            // console.log(association);

            const templateSource = document.querySelector('.labelTemplate');
            const clone = document.importNode(templateSource.content, true);

            const newLabel = clone.querySelector('.tag');

            const deleteLabelBtn = document.querySelector('#btnDeleteLabel');
            const cloneBtn = document.importNode(deleteLabelBtn.content, true);

            const removeLabelFromCardBtn = cloneBtn.querySelector('.delete');

            removeLabelFromCardBtn.addEventListener(
              'click',
              labelModule.removeLabelFromCard
            );

            newLabel.textContent = label.name;
            newLabel.style.backgroundColor = label.color;

            newLabel.id = label.id;

            newLabel.dataset.labelOfCardId = currentCardId;

            newLabel.append(cloneBtn);

            currentCardContent.prepend(newLabel);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    // close all drop down menu after selection of a label
    const dropdowns = document.querySelectorAll('.dropdown');
    for (const dropdown of dropdowns) {
      dropdown.classList.remove('is-active');
    }
    window.removeEventListener('click', labelModule.closeLabelMenu);
  },

  showLabelMenu: (e) => {
    const card = e.target.closest('.box');
    card.querySelector('.dropdown').classList.toggle('is-active');

    window.addEventListener('click', labelModule.closeLabelMenu);
    window.addEventListener('contextmenu', labelModule.closeLabelMenu);
  },

  closeLabelMenu: (e) => {
    switch (e.target.className) {
      case 'column is-one-quarter panel':
        const dropdowns = document.querySelectorAll('.dropdown');
        for (const dropdown of dropdowns) {
          dropdown.classList.remove('is-active');
        }
        window.removeEventListener('click', labelModule.closeLabelMenu);
        break;

      default:
        break;
    }
  },

  showFormLabel: (e) => {
    labelModule.currentCard = e.target.closest('.box.card');
    // close label selector if "create new label" is selected
    if (e.target.tagName === 'A') {
      const dropdowns = document.querySelectorAll('.dropdown');
      for (const dropdown of dropdowns) {
        dropdown.classList.remove('is-active');
      }
      window.removeEventListener('click', labelModule.closeLabelMenu);
    }

    const labelModalForm = document.querySelector('#addLabelModal');
    labelModalForm.classList.add('is-active');
  },

  currentCard: null,

  handleAddLabelForm: async (e) => {
    try {
      e.preventDefault();
      e.target.closest('.modal').classList.remove('is-active');
      const data = new FormData(e.target);

      const response = await fetch(utils.base_url + `/label`, {
        method: 'POST',
        body: data,
      });

      const newLabelData = await response.json();

      if (
        labelModule.currentCard !== null &&
        newLabelData.name !== 'SequelizeUniqueConstraintError'
      ) {
        labelModule.labelList.push(newLabelData);
        labelModule.addNewLabelToOption(newLabelData);
        const currentCard = labelModule.currentCard;
        const templateSource = document.querySelector('.labelTemplate');
        const clone = document.importNode(templateSource.content, true);

        const newLabel = clone.querySelector('.tag');

        const deleteLabelBtn = document.querySelector('#btnDeleteLabel');
        const cloneBtn = document.importNode(deleteLabelBtn.content, true);

        newLabel.textContent = newLabelData.name;
        newLabel.style.backgroundColor = newLabelData.color;

        newLabel.id = newLabelData.id;

        newLabel.dataset.labelOfCardId = currentCard.dataset.cardId;

        newLabel.append(cloneBtn);

        const labelContainer = currentCard.querySelector('.cardContent');

        newLabel
          .querySelector('.delete')
          .addEventListener('click', labelModule.removeLabelFromCard);

        labelContainer.prepend(newLabel);

        labelModule.currentCard = null;
      } else {
        labelModule.labelList.push(newLabelData);
        labelModule.addNewLabelToOption(newLabelData);
      }
    } catch (error) {
      console.trace(error);
    }
  },

  removeLabelFromCard: async (e) => {
    try {
      const currentLabel = e.target.parentNode;
      const labelId = currentLabel.id;
      const cardId = currentLabel.dataset.labelOfCardId;

      const response = await fetch(
        utils.base_url + `/card/${cardId}/label/${labelId}`,
        {
          method: 'DELETE',
        }
      );

      const check = await response.json();
      // console.log(check);

      currentLabel.remove();
    } catch (error) {
      console.trace(error);
    }
  },

  showDeleteModalLabel: () => {
    // activate modal
    const deleteLabelModal = document.getElementById('deleteLabelModal');
    deleteLabelModal.classList.toggle('is-active');

    const tagToDeleteContainer = document.getElementById(
      'tagToDeleteContainer'
    );

    tagToDeleteContainer.textContent = '';

    const allLabelActive = tagToDeleteContainer.querySelectorAll('.tag');

    if (allLabelActive.length !== labelModule.labelList.length) {
      for (const existingLabel of labelModule.labelList) {
        const labelTemplate = document.querySelector('.labelTemplate');
        const cloneLabelTemplate = document.importNode(
          labelTemplate.content,
          true
        );
        const label = cloneLabelTemplate.querySelector('.tag');
        label.textContent = existingLabel.name;
        label.id = existingLabel.id;
        label.style.backgroundColor = existingLabel.color;

        const btnDeleteLabel = document.getElementById('btnDeleteLabel');
        const cloneBtn = document.importNode(btnDeleteLabel.content, true);
        const deleteBtn = cloneBtn.querySelector('.delete');

        deleteBtn.addEventListener('click', labelModule.deleteLabel);

        label.append(deleteBtn);

        tagToDeleteContainer.append(label);
      }
    }
  },

  deleteLabel: async (e) => {
    try {
      e.preventDefault();

      const currentLabel = e.target.closest('.tag');
      const labelId = currentLabel.id;

      const response = await fetch(utils.base_url + `/label/${labelId}`, {
        method: 'DELETE',
      });

      const check = await response.json();

      currentLabel.remove();

      // remove tag from select options
      const currentLabelOption_s = document.querySelectorAll(
        `#dropdown-menu .dropdown-content [id="${currentLabel.textContent}"]`
      );

      for (const currentLabelOption of currentLabelOption_s) {
        currentLabelOption.remove();
      }

      // remove tag from card
      const currentLabelInCard_s = document.querySelectorAll(
        `.cardContent [id="${currentLabel.id}"]`
      );
      for (const currentLabelInCard of currentLabelInCard_s) {
        currentLabelInCard.remove();
      }
      // remove label from labelModule.labelList
      labelModule.labelList = labelModule.labelList.filter(
        (x) => currentLabel.textContent !== x.name
      );
    } catch (error) {
      console.trace(error);
    }
  },

  showUpdateModal: () => {
    const modal = document.getElementById('updateModaleLabel');
    modal.classList.remove('is-active');
    // activate modal
    const updateLabelModal = document.getElementById('updateLabelModal');
    updateLabelModal.classList.add('is-active');

    const tagToUpdateContainer = document.getElementById(
      'tagToUpdateContainer'
    );

    tagToUpdateContainer.textContent = '';

    const allLabelActive = tagToUpdateContainer.querySelectorAll('.tag');

    if (allLabelActive.length !== labelModule.labelList.length) {
      for (const existingLabel of labelModule.labelList) {
        const labelTemplate = document.querySelector('.labelTemplate');
        const cloneLabelTemplate = document.importNode(
          labelTemplate.content,
          true
        );
        const label = cloneLabelTemplate.querySelector('.tag');
        label.textContent = existingLabel.name;
        label.id = existingLabel.id;
        label.style.backgroundColor = existingLabel.color;

        label.addEventListener('click', labelModule.updateLabelForm);

        tagToUpdateContainer.append(label);
      }
    }
  },

  rgbToHex: (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  updateLabelForm: (e) => {
    const labelId = e.target.id;
    const updateLabelModal = document.getElementById('updateLabelModal');
    updateLabelModal.classList.remove('is-active');

    const modal = document.getElementById('updateModaleLabel');
    modal.classList.add('is-active');

    const cancels = modal.querySelectorAll('.cancel');
    for (const cancel of cancels) {
      cancel.addEventListener('click', labelModule.showUpdateModal);
    }

    const inputText = modal.querySelector('input[type="text"]');
    const inputColor = modal.querySelector('input[type="color"]');
    inputText.value = e.target.textContent;

    const [r, g, b] = e.target.style.backgroundColor
      .slice(4)
      .slice(0, -1)
      .split(', ');
    inputColor.value = labelModule.rgbToHex(+r, +g, +b);

    const submit = modal.querySelector('.is-success');

    const oldName = e.target.textContent;

    submit.addEventListener('click', (event) => {
      labelModule.handleUpdateLabelForm(event, labelId, oldName);
    });
  },

  handleUpdateLabelForm: async (e, labelId, oldName) => {
    e.preventDefault();
    const form = e.target.closest('form');
    const dataForm = new FormData(form);

    const reponse = await fetch(utils.base_url + `/label/${labelId}`, {
      method: 'PATCH',
      body: dataForm,
    });

    const labelPatched = await reponse.json();

    // const label_Update = document.querySelector(`#tagToUpdateContainer [id="${labelId}"]`)

    const labelInList = labelModule.labelList.find((x) => x.id === +labelId);
    labelModule.labelList = labelModule.labelList.filter(
      (x) => x.id !== +labelId
    );
    labelInList.name = labelPatched.name;
    labelInList.color = labelPatched.color;
    labelModule.labelList.push(labelInList);

    const labelOptions = document.querySelectorAll(
      `.dropdown-item[id="${oldName}"]`
    );
    for (const label of labelOptions) {
      label.id = labelPatched.name;
      label.textContent = labelPatched.name;
      label.style.color = labelPatched.color;
    }
    console.log(labelOptions);

    const labels = document.querySelectorAll(`.tag[id="${labelId}"]`);
    for (const label of labels) {
      label.textContent = labelPatched.name;
      label.style.backgroundColor = labelPatched.color;
      const deleteLabelBtn = document.querySelector('#btnDeleteLabel');
      const cloneBtn = document.importNode(deleteLabelBtn.content, true);
      const realBtnClose = cloneBtn.querySelector('.delete')
      realBtnClose.addEventListener('click', labelModule.removeLabelFromCard)
      label.append(cloneBtn);

    }
  },
};

module.exports = labelModule

},{"./utils":5}],4:[function(require,module,exports){
const cardModule = require('./card')
const utils = require('./utils')

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



module.exports = listModule

},{"./card":2,"./utils":5}],5:[function(require,module,exports){
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


},{}]},{},[1]);
