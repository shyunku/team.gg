<script>
  import MainContentLayout from "../../layouts/MainContentLayout.svelte";
  import { updateCustomGameConfigurationName } from "../../thunks/GeneralThunk";
  import { toRelativeTime } from "../../utils/Datetime";
  import { toasts } from "svelte-toasts";
  import { tick } from "svelte";
  import FaPencilAlt from "svelte-icons/fa/FaPencilAlt.svelte";
  import "./CustomGameHeader.scss";

  export let configId = null;
  export let name = "";
  export let lastUpdatedAt = null;
  export let onNameChanged = () => {};

  let editing = false;
  let draftName = "";
  let nameInput;

  const startEditing = async () => {
    draftName = name ?? "";
    editing = true;
    await tick();
    nameInput?.focus();
    nameInput?.select();
  };

  const cancelEditing = () => {
    editing = false;
    draftName = name ?? "";
  };

  const saveName = async () => {
    if (!editing) return;
    const nextName = draftName.trim();
    if (nextName === (name ?? "")) {
      cancelEditing();
      return;
    }
    if (!nextName) {
      toasts.add({ title: "이름 수정", description: "구성 이름을 입력해주세요.", type: "warning" });
      nameInput?.focus();
      return;
    }

    editing = false;
    try {
      const result = await updateCustomGameConfigurationName(configId, nextName);
      onNameChanged(result?.name ?? nextName, result?.lastUpdatedAt ?? new Date().toISOString());
    } catch (err) {
      draftName = name ?? "";
      toasts.add({ title: "이름 수정 실패", description: "구성 이름을 변경하지 못했습니다.", type: "error" });
    }
  };

  const handleKeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveName();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  };
</script>

<div class="custom-game-header">
  <MainContentLayout>
    <div class="header">
      <div class="title-row">
        {#if editing}
          <input
            class="title title-input"
            bind:this={nameInput}
            bind:value={draftName}
            maxlength="100"
            aria-label="내전 팀 구성 이름"
            on:keydown={handleKeydown}
            on:blur={saveName}
          />
        {:else}
          <div class="title">{name}</div>
        {/if}
        {#if !editing && configId}
          <button class="edit-name" type="button" aria-label="구성 이름 수정" title="이름 수정" on:click={startEditing}>
            <FaPencilAlt />
          </button>
        {/if}
      </div>
      <div class="last-update-time">최종 수정: {toRelativeTime(new Date(lastUpdatedAt ?? 0).getTime())}</div>
    </div>
  </MainContentLayout>
</div>
