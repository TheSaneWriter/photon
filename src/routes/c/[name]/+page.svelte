<script lang="ts">
  import { navigating, page } from '$app/stores'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { fullCommunityName, searchParam } from '$lib/util.js'
  import { onDestroy, onMount } from 'svelte'
  import { setSessionStorage } from '$lib/session.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'
  import { ChartBar, EllipsisHorizontal, Icon } from 'svelte-hero-icons'

  export let data

  let sidebar: boolean = false

  onMount(() => {
    if (browser)
      setSessionStorage('lastSeenCommunity', {
        id: data.community.community_view.community.id,
        name: fullCommunityName(
          data.community.community_view.community.name,
          data.community.community_view.community.actor_id
        ),
      })
  })

  onDestroy(() => {
    if (browser) {
      if ($navigating?.to?.route?.id == '/create/post') return

      setSessionStorage('lastSeenCommunity', undefined)
    }
  })
</script>

<Modal bind:open={sidebar}>
  <span slot="title">About</span>
  <div class="mx-auto">
    <CommunityCard
      community_view={data.community.community_view}
      moderators={data.community.moderators}
    />
  </div>
</Modal>

<div class="flex flex-col md:flex-row gap-4 w-full">
  <div class="flex flex-col gap-3 sm:gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-3 items-center">
      <Avatar
        width={48}
        url={data.community.community_view.community.icon}
        alt={data.community.community_view.community.name}
      />
      <div class="flex flex-col gap-0">
        <h1 class="font-bold text-xl">
          {data.community.community_view.community.title}
        </h1>
        <button
          on:click={() => {
            navigator?.clipboard?.writeText?.(
              `!${data.community.community_view.community.name}@${
                new URL(data.community.community_view.community.actor_id)
                  .hostname
              }`
            )

            toast({ content: 'Copied to clipboard.' })
          }}
          class="dark:text-zinc-400 text-slate-600 text-sm text-left"
        >
          !{data.community.community_view.community.name}@{new URL(
            data.community.community_view.community.actor_id
          ).hostname}
        </button>
      </div>
      <Button
        size="square-md"
        color="secondary"
        class="ml-auto"
        on:click={() => (sidebar = !sidebar)}
      >
        <Icon src={EllipsisHorizontal} size="16" mini />
      </Button>
    </div>
    <div class="flex flex-row gap-4 max-w-full w-full items-end">
      <Sort selected={data.sort} />
    </div>
    <PostFeed community={true} posts={data.posts.posts} />

    <Pageination
      page={data.page}
      cursor={{ next: data.posts.next_page }}
      on:cursor={(c) => searchParam($page.url, 'cursor', c.detail)}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    >
      {#if data.posts.posts.length > 0}
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChartBar} size="16" mini />
          <span class="font-medium text-black dark:text-white">
            {data.community.community_view.counts.users_active_day}
          </span>
          <span class="font-normal">
            Active user{data.community.community_view.counts.users_active_day >
            1
              ? 's'
              : ''}
          </span>
        </span>
      {/if}
    </Pageination>
  </div>
</div>
