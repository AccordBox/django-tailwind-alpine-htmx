import axios from "../components/axiosFactory";


export default function Task() {
  return {
    deleted: false,
    processing: false,

    async deleteTask() {
      const deleteUrl = this.$refs.button.dataset.deleteUrl;
      this.processing = true;

      try {
        await axios.delete(deleteUrl);
        this.deleted = true;
      } catch (error) {
        console.log(error);
      }

      this.processing = false;

    },

    getBtnText() {
      return this.processing ? 'Processing' : 'Delete';
    },

  };
}
