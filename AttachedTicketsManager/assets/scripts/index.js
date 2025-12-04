const client = ZAFClient.init();
let colorScheme = '';

const bodyElement = document.querySelector('.body');
const scrollbarContainer = document.querySelector('.scrollbar-container');
const headerSectionElement = document.querySelector('.header-section');
const ticketListsElements = document.querySelector('.related-ticket-lists');
const linkedTicketsDisplayContainer = document.querySelector('.linked-tickets-display-container');

const testRunNavButton = document.getElementById('test-run-container-btn');
const incidentsNavButton = document.getElementById('incidents-container-btn');
const regressionsNavButton = document.getElementById('regressions-container-btn');

const testRunsContainer = document.querySelector('.test-runs-container');
const regressionsContainer = document.querySelector('.regressions-container');
const incidentsContainer = document.querySelector('.incidents-container');

client.invoke('resize', { width: '100%', height: '500px' });
const ticketData = new Ticket();
const uiToolbox = new ManageUiToolbox();
const testRunSection = new TestRunsSection();
const testRunGraph = new Graph();
client.get('colorScheme').then((result) => {
  colorScheme = result.colorScheme;

  testRunSection.createNewTestRunForm(colorScheme);
  if (colorScheme === 'dark') {
    bodyElement.classList.add('dark');
    scrollbarContainer.classList.add('dark');
    headerSectionElement.classList.add('dark');
    ticketListsElements.classList.add('dark');
    linkedTicketsDisplayContainer.classList.add('dark');
  }
});

function ChangeListView(mode) {
  const navButtons = { testRunNavButton, regressionsNavButton, incidentsNavButton };
  const navContainers = { testRunsContainer, incidentsContainer, regressionsContainer };
  if (mode === 'test-run' && ticketData.testRuns) {
    !document.getElementById('timeContainer').hasChildNodes() &&
      testRunGraph.createFailedTestRunsTimeline(ticketData.testRuns);
    testRunsContainer.childElementCount === 1 &&
      uiToolbox.addToList(ticketData.testRuns, testRunsContainer);
    uiToolbox.showElement(testRunsContainer, testRunNavButton, navButtons, navContainers);
    //at the moment we will not use this because it creates too much noise
    //the test runs container starts out with a child node which displays the create test run wizard
  } else if (mode === 'incidents' && ticketData.incidents) {
    !incidentsContainer.hasChildNodes() &&
      uiToolbox.addToList(ticketData.incidents, incidentsContainer);
    uiToolbox.showElement(incidentsContainer, incidentsNavButton, navButtons, navContainers);
  } else if (mode === 'regressions' && ticketData.regressions) {
    !regressionsContainer.hasChildNodes() &&
      uiToolbox.addToList(ticketData.regressions, regressionsContainer);
    uiToolbox.showElement(regressionsContainer, regressionsNavButton, navButtons, navContainers);
  } else {
    uiToolbox.showElement(false);
  }
}

testRunNavButton.addEventListener('click', async () => {
  !ticketData.testRuns && (await ticketData.fetchTestRuns());
  ChangeListView('test-run');
});
incidentsNavButton.addEventListener('click', async () => {
  !ticketData.incidents && (await ticketData.fetchRelatedIncidents());
  ChangeListView('incidents');
});
regressionsNavButton.addEventListener('click', async () => {
  !ticketData.regressions && (await ticketData.fetchRelatedRegressions());
  ChangeListView('regressions');
});
