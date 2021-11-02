export default function Counter() {
  return {
    count: 0,

    handleClick() {
      this.count++;
    },

  };
}
