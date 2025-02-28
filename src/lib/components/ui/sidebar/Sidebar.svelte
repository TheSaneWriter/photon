<script lang="ts">
  import {
    ArrowLeftOnRectangle,
    Cog6Tooth,
    GlobeAlt,
    Home,
    Icon,
    Identification,
    ServerStack,
    UserGroup,
  } from 'svelte-hero-icons'
  import { profile, profileData } from '$lib/auth.js'
  import { userSettings } from '$lib/settings.js'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import CommunityList from '$lib/components/ui/sidebar/CommunityList.svelte'
  import ProfileButton from '$lib/components/ui/sidebar/ProfileButton.svelte'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { Button } from 'mono-svelte'

  export let route = ''
</script>

<nav
  class="flex flex-col pl-4 pr-4 py-4 overflow-auto
  gap-1 max-h-[calc(100svh-4rem)] {$$props.class}"
  style={$$props.style}
>
  <SidebarButton href="/">
    <Icon src={Home} mini={route == '/'} size="20" title="Frontpage" />
    <span>Frontpage</span>
  </SidebarButton>
  <SidebarButton href="/settings">
    <Icon
      src={Cog6Tooth}
      mini={route == '/settings'}
      size="20"
      title="Settings"
    />
    <span>Settings</span>
  </SidebarButton>
  <SidebarButton href="/communities">
    <Icon mini={route == '/communities'} src={GlobeAlt} size="20" />
    <span>Communities</span>
  </SidebarButton>
  {#if $profileData.profiles.length >= 1}
    <hr class="border-slate-300 dark:border-zinc-800 my-1" />
    {#each $profileData.profiles as prof, index (prof.id)}
      <div animate:flip={{ duration: 300, easing: expoOut }} class="w-full">
        <ProfileButton {index} {prof} />
      </div>
    {/each}
    <SidebarButton href="/accounts">
      <Icon src={UserGroup} mini size="20" />
      <span>Accounts</span>
    </SidebarButton>
  {/if}
  <hr class="border-slate-300 dark:border-zinc-800 my-1" />
  {#if $profile?.user}
    {#if $profile?.user.moderates.length > 0}
      <CommunityList items={$profile.user.moderates.map((i) => i.community)} />
      <hr class="border-slate-300 dark:border-zinc-800 my-1" />
    {/if}

    <CommunityList items={$profile.user.follows.map((i) => i.community)} />
  {:else}
    <Button
      class="hover:bg-slate-200"
      href="/login"
      color="tertiary"
      alignment="left"
      title="Log In"
    >
      <Icon mini src={ArrowLeftOnRectangle} size="20" />
      <span>Log In</span>
    </Button>
    <Button
      class="hover:bg-slate-200"
      href="/signup"
      color="tertiary"
      alignment="left"
      title="Sign Up"
    >
      <Icon mini src={Identification} size="20" />
      <span>Sign Up</span>
    </Button>
    <Button
      class="hover:bg-slate-200"
      href="/accounts"
      color="tertiary"
      alignment="left"
      title="Change Instance"
    >
      <Icon mini src={ServerStack} size="20" />
      <span>Change instance</span>
    </Button>
  {/if}
</nav>
