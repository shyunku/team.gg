<script>
  export let onEnter = () => {};
  export let onKeyDown = () => {};

  let onRawKeyDown = (e) => {
    onKeyDown();
    if (e.key === "Enter") {
      onEnter();
    }
  };
</script>

<input on:keydown={onRawKeyDown} {...$$restProps} />
