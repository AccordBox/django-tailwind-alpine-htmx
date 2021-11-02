import axios from "./axiosFactory";
import htmx from "htmx.org/dist/htmx";

function sleep(ms) {
  return new window.Promise(resolve => setTimeout(resolve, ms));
}

export default function ModalFormHTMX() {
  return {
    open: false,

    async loadForm() {
      const modalBodyDiv = this.$refs.modelForm.querySelector('.htmx-modal-body');
      modalBodyDiv.innerHTML = 'Loading...';

      const url = this.$refs.modelForm.dataset.url;
      this.open = true;

      try {
        const response = await axios.get(url);
        modalBodyDiv.innerHTML = response.data;

        // Processes new content, enabling htmx behavior.
        // This can be useful if you have content that is added to the DOM
        // outside of the normal htmx request cycle but still want htmx attributes to work.
        htmx.process(modalBodyDiv);

      } catch (error) {
        modalBodyDiv.innerHTML = 'Load form error';
      }
    },

    setOpen(state) {
      this.open = state;
    },

    async handleModalResponse(event){
      // wait 1 second and then redirect to the next page
      await sleep(1000);
      window.location.href = event.detail.next;
    }

  };
}