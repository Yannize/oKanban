// const utils = require('./utils')
// const labelModule = require('./label')

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

// module.exports = cardModule
