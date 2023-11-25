<script>
  const onImageLoadError = (e) => {
    e.target.src = "/img/common/null.png";
    // e.target.style.backgroundColor = "#111";
  };
</script>

<img on:error={onImageLoadError} {...$$restProps} />
