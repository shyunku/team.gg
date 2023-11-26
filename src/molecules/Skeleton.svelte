<script>
  export let width = "300px";
  export let height = "25px";
  export let padding = "auto";
</script>

<div class="loader" style={`width: ${width};  padding: ${padding}`}>
  &nbsp;
  <div class="effect"></div>
</div>

<style>
  .loader {
    overflow: hidden;
    /* padding: 25px 0; */
    box-sizing: border-box;
    position: relative;
  }

  .effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: white;
    opacity: 0.15;

    mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
    mask-size: 200% 100%;
    -webkit-mask-size: 200% 100%;
    mask-repeat: repeat;
    -webkit-mask-repeat: repeat;
    mask-position: 50% top;
    -webkit-mask-position: 50% top;

    animation: wave 1s infinite;

    color: white;
  }

  @keyframes wave {
    0% {
      -webkit-mask-position: 50% top;
      mask-position: 50% top;
    }
    100% {
      -webkit-mask-position: -150% top;
      mask-position: -150% top;
    }
  }
</style>
