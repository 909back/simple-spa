import PageLayout from './components/PageLayout.js'
import DraftCard from './components/draft-card.js'
import ConfirmDialog from './components/confirm-dialog.js';
import routes from './routes/index.js';
import SinglePage from './components/SinglePage.js';

customElements.define('confirm-dialog', ConfirmDialog);
customElements.define("draft-card", DraftCard);
customElements.define('page-layout', PageLayout)


const trigger = document.getElementById("trigger");
console.log(trigger)
const modal = document.querySelector('confirm-dialog') as ConfirmDialog;
trigger?.addEventListener('click', () => {
    modal.openModal();
});

const initalRoute = routes[0]
new SinglePage(initalRoute)
