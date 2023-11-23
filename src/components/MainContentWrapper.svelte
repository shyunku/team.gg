<div class="main-content-expanded-wrapper">
  <div class="main-content-wrapper">
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
    flex: 1;
  }

  .main-content-wrapper {
    display: flex;
    width: $main-content-width;
  }
</style>
