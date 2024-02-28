<script>
  let { class: _class, ...rest } = $$restProps;
</script>

<div class="main-content-expanded-wrapper">
  <div class={"main-content-wrapper " + (_class ? _class : "")} {...rest}>
    <!-- child -->
    <slot />
  </div>
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .main-content-expanded-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1240px) {
    .main-content-wrapper {
      width: 100% !important;
      padding: 0 20px;
      box-sizing: border-box;
      // overflow-x: overlay;
    }
  }

  .main-content-wrapper {
    display: flex;
    width: $main-content-width;
    height: 100%;
  }
</style>
