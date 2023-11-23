<script>
  import MainContentWrapper from "../components/MainContentWrapper.svelte";
</script>

<div class="header">
  <MainContentWrapper>
    <div class="app-icon">
      <img src="https://via.placeholder.com/100x32" />
    </div>
    <div class="app-menu">
      <div class="app-menu-item">전적 검색</div>
      <div class="app-menu-item">내전 팀 구성</div>
    </div>
  </MainContentWrapper>
</div>

<style lang="scss">
  .header {
    display: flex;
    align-items: center;
    // background-color: rgb(118, 25, 180);
    color: white;
    height: 48px;
    padding: 0 12px;
    border-bottom: 1px solid rgb(61, 61, 64);
  }

  .app-menu {
    display: flex;
    margin-left: 30px;
    align-items: center;

    .app-menu-item {
      cursor: pointer;
      //   font-weight: bold;
      color: rgb(205, 190, 145);

      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
</style>
