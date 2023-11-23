<script>
  import MainContentWrapper from "../../layouts/MainContentLayout.svelte";
</script>

<div class="player-stat-menu">
  <MainContentWrapper>
    <div class="menu-items">
      <div class="stat-menu-item selected">종합</div>
      <div class="stat-menu-item">인게임</div>
      <div class="stat-menu-item">숙련도</div>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  @import "../../styles/variables.scss";

  .player-stat-menu {
    width: 100%;
    padding: 5px 0;
    background-color: $sub-bg-color;
    border-bottom: 1px solid $sub-border-color;
  }

  .menu-items {
    display: flex;
    align-items: center;

    .stat-menu-item {
      display: flex;
      width: 80px;
      justify-content: center;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;
      color: rgb(202, 183, 151);

      &:hover {
        background-color: rgb(53, 49, 41);
        padding: 6px 0;
      }

      &.selected {
        background-color: rgb(84, 78, 65);
        padding: 6px 0;
        color: white;
      }

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
</style>
