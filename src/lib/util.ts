import { goto } from '$app/navigation'
import { toast } from 'mono-svelte'
import { userSettings } from '$lib/settings.js'
import { get } from 'svelte/store'
import type { GetPostResponse, PostView, SubscribedType } from 'lemmy-js-client'
import { page } from '$app/stores'

export const findClosestNumber = (numbers: number[], target: number): number =>
  numbers.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  )

export const searchParam = (
  url: URL,
  key: string,
  value: string,
  ...deleteKeys: string[]
) => {
  url.searchParams.set(key, value)
  deleteKeys.forEach((k) => url.searchParams.delete(k))
  goto(url, {
    invalidateAll: true,
  })
}

export const fullCommunityName = (name: string, actorId: string) =>
  `${name}@${new URL(actorId).hostname}`

export const placeholders = {
  url: ['https://notas.cam', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
  post: [
    'Is starting nuclear warfare illegal?',
    'A cool photo I took before the destruction of mankind!',
    'AITA for ending all contention and causing world peace?',
    'BREAKING NEWS: Police break into gun shop, find weapons',
    'How do I make sure my pet rock stays alive?',
    'My cat just invented a time machine, what do I do?',
    'Unpopular opinion: world peace and global happiness would be beneficial to humanity',
    'LPT: The smaller weights are easier to lift than the bigger weights in a gym',
    'javascript bad',
    'ELI5: What is 4 + 8?',
  ],
  comment: [
    'aint no way',
    'new response just dropped',
    '<insert funny joke here>',
    'say, why did we name restaurant staff after computers, anyway?',
    `this.\nedit: thanks for 1 upvote😃😃😃!`,
    'Officer, I drop kicked that child in self defense! You gotta believe me man.',
    'this comment placeholder is very important dont forget',
    'As Abraham Lincoln once said, "don\'t believe everything you see on the internet."',
    'existential crisis in progress',
  ],
  get: (type: 'url' | 'post' | 'comment') => {
    return get(userSettings)?.randomPlaceholders
      ? placeholders[type][
          Math.floor(Math.random() * placeholders[type].length)
        ]
      : ''
  },
}

export function moveItem<T>(
  array: T[],
  currentIndex: number,
  newIndex: number
): T[] {
  if (
    currentIndex < 0 ||
    currentIndex >= array.length ||
    newIndex < 0 ||
    newIndex >= array.length
  ) {
    throw new Error('Invalid index')
  }

  const newArray = [...array]

  // Remove the item from the current index
  const [item] = newArray.splice(currentIndex, 1)

  // Insert the item at the new index
  newArray.splice(newIndex, 0, item)

  return newArray
}

type Maybe<T> = T | undefined | void | null
export const trycatch = <T>(func: () => T): Maybe<T> => {
  try {
    return func()
  } catch (err) {
    toast({
      content: err as any,
      type: 'error',
    })
  }
}

export const removeItem = <T>(array: T[], predicate: (item: T) => boolean) => {
  array.splice(array.findIndex(predicate), 1)
}

export const DOMAIN_REGEX = /^((?!-)[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}/gi
export const DOMAIN_REGEX_FORMS = '^((?!-)[A-Za-z0-9-]{1,63}.)+[A-Za-z]{2,63}'

export const isSubscribed = (subscribed: SubscribedType) =>
  subscribed == 'Pending' || subscribed == 'Subscribed'

export const routes = {
  '/': 'Frontpage',
  get '/post/[instance]/[id=integer]'() {
    return get(page)?.data?.post?.post_view?.post?.name
  },
  '/settings': 'Settings',
  '/communities': 'Communities',
  '/search': 'Search',
  '/moderation': 'Moderation',
  '/create/post': 'Create post',
  '/create/community': 'Create community',
  get '/c/[name]'() {
    return get(page)?.data?.community?.community_view?.community?.title
  },
  '/accounts': 'Accounts',
  '/admin/config': 'Administration',
  '/inbox': 'Inbox',
  '/saved': 'Saved',
  '/about': 'About',
  '/profile/user': 'Profile',
  '/profile/settings': 'Profile Settings',
  '/profile/blocks': 'Blocks',
}

/**
 * This is to get a placeholder while the full data loads.
 */
export const getPostsResponseFromView = (
  post: PostView,
  instance: string
): GetPostResponse => ({
  community_view: {
    blocked: false,
    counts: {
      comments: 0,
      community_id: 0,
      hot_rank: 0,
      id: 0,
      posts: 0,
      published: '',
      subscribers: 0,
      users_active_day: 0,
      users_active_half_year: 0,
      users_active_month: 0,
      users_active_week: 0,
    },
    community: post.community,
    subscribed: post.subscribed,
  },
  cross_posts: [],
  moderators: [],
  post_view: post,
})
