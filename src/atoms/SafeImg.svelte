<script>
  const NullImgUrl = "/img/common/null.png";
  export let src = null;
  const onImageLoadError = (e) => {
    e.target.src = NullImgUrl;
    console.log(src, "err");
    // e.target.style.backgroundColor = "#111";
  };
</script>

<img on:error={onImageLoadError} src={src ?? NullImgUrl} alt="" {...$$restProps} />
