<div class="content-expanded-wrapper">
  <div class="content-wrapper">
    <!-- child -->
    <slot />
  </div>
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .content-expanded-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .content-wrapper {
    display: flex;
    width: $main-content-width;

    &.vertical {
      flex-direction: column;
    }
  }
</style>
