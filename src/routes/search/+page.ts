import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import type {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
  SearchResponse,
  SearchType,
  SortType,
} from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url, fetch }) {
  const query = url.searchParams.get('q')
  const page = Number(url.searchParams.get('page')) || 1
  const community = Number(url.searchParams.get('community')) || undefined
  const sort = url.searchParams.get('sort') || 'New'
  const type = url.searchParams.get('type') || 'All'

  if (query) {
    const results = await getClient(undefined, fetch).search({
      q: query,
      auth: get(profile)?.jwt,
      community_id: community ?? undefined,
      limit: 40,
      page: page,
      sort: (sort as SortType) || 'New',
      listing_type: 'All',
      type_: (type as SearchType) ?? 'All',
    })

    const [posts, comments, users, communities] = [
      results.posts,
      results.comments,
      results.users,
      results.communities,
    ]

    const everything = [...posts, ...comments, ...users, ...communities].sort(
      (a, b) =>
        Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a))
    )

    return {
      type: type,
      sort: sort,
      page: page,
      query: query,
      results: everything,
      streamed: {
        object: get(profile)?.jwt
          ? getClient(undefined, fetch).resolveObject({
              auth: get(profile)!.jwt!,
              q: query,
            })
          : undefined,
      },
    }
  }

  return {
    page: 1,
    sort: sort,
    type: type,
    query: query,
  }
}
