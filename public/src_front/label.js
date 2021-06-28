// const utils = require('./utils');

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
      const realBtnClose = cloneBtn.querySelector('.delete');
      realBtnClose.addEventListener('click', labelModule.removeLabelFromCard);
      label.append(cloneBtn);
    }
  },
};

// module.exports = labelModule;
