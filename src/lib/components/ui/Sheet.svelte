<script lang="ts">
  import { Material } from 'mono-svelte'
  import { expoOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'

  export let open: boolean = false
  let el: HTMLDivElement
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if open}
  <div
    class="fixed top-16 pb-[72px] pt-2 right-0 w-screen h-screen overflow-auto bg-black/50
flex flex-col z-[100] overscroll-contain"
    transition:fade={{ duration: 150 }}
    on:click={(e) => {
      // @ts-ignore
      if (e.target?.contains(el)) open = false
    }}
  >
    <div
      class="dark:bg-zinc-950 bg-white p-4 md:p-6 h-full md:w-3/5 w-full ml-auto
      flex flex-col gap-4 overflow-auto rounded-l-xl border-l border-slate-200
       dark:border-zinc-800 overscroll-contain"
      transition:fly={{ x: 20, duration: 200, easing: expoOut }}
      bind:this={el}
    >
      <slot />
    </div>
  </div>
{/if}
