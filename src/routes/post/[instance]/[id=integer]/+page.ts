import { env } from '$env/dynamic/public'
import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { SSR_ENABLED, userSettings } from '$lib/settings.js'
import { error } from '@sveltejs/kit'
import type {
  CommentSortType,
  GetCommentsResponse,
  GetPostResponse,
} from 'lemmy-js-client'
import { get } from 'svelte/store'

export const _getPost = async (
  id: number,
  instance: string,
  thread?: string | null
) => {
  const post = await getClient(instance.toLowerCase(), fetch).getPost({
    id: Number(id),
    auth: get(profile)?.jwt,
  })

  let max_depth = post.post_view.counts.comments > 100 ? 1 : 3

  let parentId: number | undefined

  if (thread) {
    parentId = Number(thread.split('.')[1])

    if (!Number.isInteger(parentId)) {
      parentId = undefined
    }
  }

  if (parentId) {
    max_depth = 10
  }

  const sort = get(userSettings)?.defaultSort?.comments ?? 'Hot'

  const commentParams: any = {
    post_id: Number(id),
    type_: 'All',
    limit: 50,
    page: 1,
    max_depth: max_depth,
    saved_only: false,
    sort: sort,
    auth: get(profile)?.jwt,
    parent_id: parentId,
  }

  return {
    singleThread: parentId != undefined,
    post: post,
    commentSort: sort,
    streamed: {
      comments: SSR_ENABLED
        ? await getClient(instance, fetch).getComments(commentParams)
        : getClient(instance, fetch).getComments(commentParams),
    },
    instance: instance,
  } as {
    singleThread: boolean
    post: GetPostResponse
    commentSort: CommentSortType
    streamed: {
      comments: Promise<GetCommentsResponse> | undefined
    }
    instance: string
  }
}

export async function load({ params, url, fetch }) {
  return _getPost(
    Number(params.id),
    params.instance,
    url.searchParams.get('thread')
  )
}
