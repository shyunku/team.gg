<script>
  import IoIosPlay from "svelte-icons/io/IoIosPlay.svelte";

  export let direction = 0;
</script>

<div class={"sort-visualizer" + ` dir-${direction}`}>
  <div class="arrow-up arrow">
    <IoIosPlay />
  </div>
  <div class="arrow-down arrow">
    <IoIosPlay />
  </div>
</div>

<style lang="scss">
  .sort-visualizer {
    display: flex;
    flex-direction: column;
    width: 16px;
    $magnetic-margin: 4px;

    &.dir-1 .arrow-up {
      opacity: 1;
    }

    &.dir--1 .arrow-down {
      opacity: 1;
    }

    .arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.15;
    }

    .arrow-up {
      transform: scaleY(0.5) rotate(-90deg);
      margin-bottom: -$magnetic-margin;
    }
    .arrow-down {
      transform: scaleY(0.5) rotate(90deg);
      margin-top: -$magnetic-margin;
    }
  }
</style>
