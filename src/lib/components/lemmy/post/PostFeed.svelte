<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import Sheet from '$lib/components/ui/Sheet.svelte'
  import { instance } from '$lib/instance.js'
  import { userSettings } from '$lib/settings.js'
  import type {
    GetCommentsResponse,
    GetPostResponse,
    PostView,
  } from 'lemmy-js-client'
  import { Button, Spinner } from 'mono-svelte'
  import { ArchiveBox, Icon, Plus } from 'svelte-hero-icons'
  import { fly } from 'svelte/transition'
  import { _getPost } from '../../../../routes/post/[instance]/[id=integer]/+page.js'
  import { getPostsResponseFromView } from '$lib/util.js'

  export let posts: PostView[]
  export let community: boolean = false

  let openPost: PostView | undefined = undefined
  let openSheet = false

  $: placeholder = openPost
    ? getPostsResponseFromView(openPost, $instance)
    : undefined

  let comments: Promise<GetCommentsResponse> | undefined = undefined

  const fullData = async () => {
    if (!placeholder) return
    const data = await _getPost(placeholder.post_view.post.id, $instance)

    placeholder = data.post
    comments = data.streamed.comments
  }
</script>

{#if openPost}
  <Sheet bind:open={openSheet}>
    {#await import('../../../../routes/post/[instance]/[id=integer]/+page.svelte')}
      <Spinner />
    {:then { default: PostPage }}
      {#if placeholder}
        <PostPage
          data={{
            post: placeholder,
            commentSort: 'Hot',
            instance: $instance,
            singleThread: false,
            streamed: { comments: comments },
          }}
          on:back={() => (openSheet = false)}
        />
      {/if}
    {/await}
  </Sheet>
{/if}

<div
  class="flex flex-col {$userSettings.view == 'card'
    ? 'gap-3 md:gap-4'
    : ''} divide-slate-200 dark:divide-zinc-800 z-[5]"
  class:divide-y={$userSettings.view != 'card'}
>
  {#if posts.length == 0}
    <div class="h-full grid place-items-center">
      <Placeholder
        icon={ArchiveBox}
        title="No posts"
        description="There are no posts that match this filter."
      >
        <Button href="/communities">
          <Icon src={Plus} size="16" mini slot="prefix" />
          <span>Follow some communities</span>
        </Button>
      </Placeholder>
    </div>
  {:else}
    {#each posts as post, index (post.post.id)}
      {#if !($userSettings.hidePosts.deleted && post.post.deleted) && !($userSettings.hidePosts.removed && post.post.removed)}
        <button
          on:click={() => {
            openPost = post
            openSheet = true
          }}
          class="text-left"
          in:fly|global={{
            y: -8,
            duration: 500,
            opacity: 0,
            delay: index < 4 ? index * 100 : 0,
          }}
        >
          <Post hideCommunity={community} view={$userSettings.view} bind:post />
        </button>
      {/if}
    {/each}
  {/if}
</div>
