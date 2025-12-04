class ManageUiToolbox {
  constructor() {
    this.appendList = this.addToList.bind(this);
    this.createListItem = this.createListItem.bind(this);
    this.createSuccessIcon = this.createSuccessIcon.bind(this);
    this.showElement = this.showElement.bind(this);
  }

  showElement(
    targetElement,
    navElement,
    { testRunNavButton, regressionsNavButton, incidentsNavButton },
    { testRunsContainer, incidentsContainer, regressionsContainer }
  ) {
    testRunNavButton.classList.remove('selected');
    regressionsNavButton.classList.remove('selected');
    incidentsNavButton.classList.remove('selected');

    testRunsContainer.style.display = 'none';
    incidentsContainer.style.display = 'none';
    regressionsContainer.style.display = 'none';

    if (targetElement) {
      targetElement.style.display = 'block';
      navElement.classList.add('selected');
    }
  }

  addToList(list, parentElement, addMethod = 'append') {
    list.forEach((listItem) => {
      const container = document.createElement('div');
      container.classList.add('item-container');
      colorScheme === 'dark' && container.classList.add('dark');
      this.createListItem(listItem, container);

      if (addMethod === 'prepend') {
        parentElement.prepend(container);
        return;
      }
      parentElement.appendChild(container);
    });
  }

  createDropdownItems(items, container) {
    items.forEach((listItem) => {
      const item = document.createElement('option');
      item.id = listItem.replaceAll(' ', '');
      item.textContent = listItem;
      container.appendChild(item);
    });
  }

  async createListItem(item, container) {
    const ticketTitle = document.createElement('span');
    ticketTitle.classList.add('item-title');
    ticketTitle.title = item.subject;
    ticketTitle.textContent = item.subject;

    const ticketDate = document.createElement('span');
    const date = new Date(item.created_at);
    ticketDate.title = 'date';
    ticketDate.textContent = date.toLocaleDateString('en-US');

    const ticketId = document.createElement('a');
    ticketId.classList.add('item-id');
    ticketId.textContent = '#' + item.id;
    ticketId.target = 'blank';
    ticketId.href = 'https://justserve.zendesk.com/agent/tickets/' + item.id;

    const successStatus = await item.custom_fields.find((field) => field.id === 40282490348187);
    const successStatusIcon = this.createSuccessIcon(successStatus);

    successStatusIcon && container.appendChild(successStatusIcon);
    container.appendChild(ticketDate);
    container.appendChild(ticketTitle);
    container.appendChild(ticketId);
  }
  //lets add a date to our list items

  createSuccessIcon(successStatus) {
    //only create the success status icon if the success status is set
    if (successStatus.value === null || successStatus.value === '') {
      return null;
    }

    const successStatusIcon = document.createElement('img');
    successStatusIcon.classList.add('status-icon');
    if (successStatus.value === 'pass') {
      successStatusIcon.src = './images/check-mark.png';
      successStatusIcon.classList.add('success-icon');
      successStatusIcon.alt = 'success';
    } else if (successStatus.value === 'fail') {
      successStatusIcon.src = './images/close.png';
      successStatusIcon.classList.add('failed-icon');
      successStatusIcon.alt = 'failed';
    }
    return successStatusIcon;
  }
}
