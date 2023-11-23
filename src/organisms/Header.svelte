<script>
  import MainContentWrapper from "../layouts/MainContentLayout.svelte";
</script>

<div class="header">
  <MainContentWrapper>
    <div class="app-icon">
      <img src="https://via.placeholder.com/100x32" />
    </div>
    <div class="app-menu">
      <div class="app-menu-item selected">홈</div>
      <div class="app-menu-item">전적</div>
      <div class="app-menu-item">내전 팀 구성</div>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../styles/variables.scss";

  .header {
    display: flex;
    align-items: center;
    // background-color: rgb(118, 25, 180);
    color: white;
    height: 56px;
    padding: 0 12px;
    border-bottom: 1px solid $main-border-color;
  }

  .app-icon {
    display: flex;
    align-items: center;
  }

  .app-menu {
    display: flex;
    margin-left: 30px;
    align-items: center;
    height: 100%;
    font-weight: bold;

    .app-menu-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      //   font-weight: bold;
      height: 100%;
      color: $main-fg-color;
      font-size: 16px;
      padding: 0 18px;
      background: linear-gradient(180deg, transparent 50%, transparent 100%);
      transition: 0.5s linear;

      &:hover {
        background: linear-gradient(180deg, transparent 60%, rgba(222, 206, 160, 0.393) 100%);
      }

      &.selected {
        background: linear-gradient(180deg, transparent 60%, $highlight-color 100%);
      }

      &:not(:last-child) {
        // margin-right: 40px;
      }
    }
  }
</style>
