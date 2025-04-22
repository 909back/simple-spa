import ConfirmDialog from '../components/confirm-dialog.js';
customElements.define('confirm-dialog', ConfirmDialog);
const trigger = document.getElementById("trigger");
const modal = document.querySelector('confirm-dialog');
trigger?.addEventListener('click', () => {
    modal.openModal();
});
