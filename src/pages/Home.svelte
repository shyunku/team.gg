<script>
  import Input from "../atoms/Input.svelte";
  import MainContentWrapper from "../components/MainContentWrapper.svelte";
  import { goto } from "$app/navigation";

  const onPlayerSearch = () => {
    console.log("player");
    goto("/player");
  };
</script>

<MainContentWrapper>
  <div class="content-wrapper">
    <div class="app-logo">
      <img src="https://via.placeholder.com/320x200" />
    </div>
    <div class="summoner-searcher">
      <div class="summoner-region">
        <select>
          <option>KR</option>
          <option>NA</option>
          <option>EU</option>
        </select>
      </div>
      <Input
        type="text"
        placeholder="소환사명을 입력하세요"
        spellcheck="false"
        onEnter={onPlayerSearch}
      />
    </div>
  </div>
</MainContentWrapper>

<style lang="scss">
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .app-logo {
    margin-top: 100px;
    margin-bottom: 50px;
  }

  .summoner-searcher {
    display: flex;
    align-items: center;

    input {
      margin-left: 15px;
      width: 500px;
      height: 40px;
      background-color: black;
      color: white;
      padding: 8px 12px;
      border: 1px solid rgb(67, 67, 67);
      border-radius: 5px;
    }
  }
</style>
