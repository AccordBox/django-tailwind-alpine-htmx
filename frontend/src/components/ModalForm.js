import axios from "../components/axiosFactory";

function serialize(data) {
  let obj = {};
  for (let [key, value] of data) {
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

function sleep(ms) {
  return new window.Promise(resolve => setTimeout(resolve, ms));
}

export default function ModalForm() {
  return {
    open: false,
    processing: false,
    formHtml: '',

    async loadForm() {
      const url = this.$refs.modelForm.dataset.url;
      this.open = true;
      this.formHtml = 'Loading...';

      try {
        const response = await axios.get(url);
        this.formHtml = response.data;
      } catch (error) {
        this.formHtml = 'Load form error';
      }

    },

    setOpen(state) {
      this.open = state;
    },

    async submitHandler() {
      this.processing = true;

      const modelForm = this.$refs.modelForm;
      const url = modelForm.dataset.url;
      const form = modelForm.querySelector('form');
      let data = new FormData(form);
      let formData = serialize(data);

      try {
        const response = await axios.post(
          url,
          formData
        );
        const respData = response.data;
        if (typeof respData === 'object' && respData !== null){
          // We can display the message or redirect to other page
          const {next, message} = respData;
          this.formHtml = message;

          // wait 1 second and then redirect to the next page
          await sleep(1000);
          window.location.replace(next);
        } else {
          // set HTML to display form validation error
          this.formHtml = respData;
        }
      } catch (error) {
        this.formHtml = 'Something Wrong happened';
        console.log(error);
      }

      this.processing = false;
    },

    getBtnText() {
      return this.processing ? 'Processing' : 'Submit';
    },

  };
}