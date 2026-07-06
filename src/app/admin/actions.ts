'use server'

import { redirect } from 'next/navigation'
import { requireAdminAction } from '@/server/_shared/auth/admin-context'
import {
  replyAdminComment,
  sendCommentSmtpTest,
  updateAdminCommentStatus,
  updateAdminCommentStatuses,
  updateCommentAvatarSettings,
  updateCommentEmojiPacks,
  updateCommentSmtpSettings,
} from '@/server/comments/adapters/actions'
import {
  deleteAlbumPhoto,
  saveAlbumCategory,
  saveAlbumPhoto,
} from '@/server/album/adapters/actions'
import {
  deleteStackItem,
  saveStackCategory,
  saveStackItem,
} from '@/server/stack/adapters/actions'
import {
  approveFriendApplication,
  deleteFriendLink,
  refreshFriendFeedSnapshots,
  saveFriendApplicationSettings,
  saveFriendGroup,
  saveFriendLink,
  updateFriendApplicationStatus,
} from '@/server/friends/adapters/actions'
import { saveHomeSection } from '@/server/home/adapters/actions'
import {
  deleteWatchedItem,
  saveWatchedItem,
} from '@/server/watched/adapters/actions'
import { saveAdminPost } from '@/server/posts/adapters/actions'
import { deleteAdminMedia, uploadAdminMedia } from '@/server/media/adapters/actions'
import type { CurrentAdmin } from '@/lib/auth/admin'

async function runAdminAction<T>(
  handler: (admin: CurrentAdmin) => Promise<T> | T
) {
  const admin = await requireAdminAction()
  return handler(admin)
}

export async function savePost(formData: FormData) {
  return runAdminAction(admin => saveAdminPost(admin, formData))
}

export async function updateCommentStatus(formData: FormData) {
  return runAdminAction(admin => updateAdminCommentStatus(admin, formData))
}

export async function updateCommentStatuses(formData: FormData) {
  return runAdminAction(admin => updateAdminCommentStatuses(admin, formData))
}

export async function replyComment(formData: FormData) {
  return runAdminAction(admin => replyAdminComment(admin, formData))
}

export async function saveCommentEmojiPacks(formData: FormData) {
  return runAdminAction(admin => updateCommentEmojiPacks(admin, formData))
}

export async function saveCommentAvatarSettings(formData: FormData) {
  return runAdminAction(admin => updateCommentAvatarSettings(admin, formData))
}

export async function saveCommentSmtpSettings(formData: FormData) {
  return runAdminAction(admin => updateCommentSmtpSettings(admin, formData))
}

export async function sendCommentSmtpTestAction(formData: FormData) {
  return runAdminAction(admin => sendCommentSmtpTest(admin, formData))
}

export async function saveWatched(formData: FormData) {
  return runAdminAction(admin => saveWatchedItem(admin, formData))
}

export async function deleteWatched(formData: FormData) {
  return runAdminAction(admin => deleteWatchedItem(admin, formData))
}

export async function saveAlbumCategoryAction(formData: FormData) {
  return runAdminAction(admin => saveAlbumCategory(admin, formData))
}

export async function saveAlbumPhotoAction(formData: FormData) {
  return runAdminAction(admin => saveAlbumPhoto(admin, formData))
}

export async function deleteAlbumPhotoAction(formData: FormData) {
  return runAdminAction(admin => deleteAlbumPhoto(admin, formData))
}

export async function saveStackCategoryAction(formData: FormData) {
  return runAdminAction(admin => saveStackCategory(admin, formData))
}

export async function saveStackItemAction(formData: FormData) {
  return runAdminAction(admin => saveStackItem(admin, formData))
}

export async function deleteStackItemAction(formData: FormData) {
  return runAdminAction(admin => deleteStackItem(admin, formData))
}

export async function saveFriendGroupAction(formData: FormData) {
  return runAdminAction(admin => saveFriendGroup(admin, formData))
}

export async function saveFriendLinkAction(formData: FormData) {
  return runAdminAction(admin => saveFriendLink(admin, formData))
}

export async function deleteFriendLinkAction(formData: FormData) {
  return runAdminAction(admin => deleteFriendLink(admin, formData))
}

export async function refreshFriendFeeds() {
  return runAdminAction(admin => refreshFriendFeedSnapshots(admin))
}

export async function saveFriendApplicationSettingsAction(formData: FormData) {
  return runAdminAction(admin => saveFriendApplicationSettings(admin, formData))
}

export async function updateFriendApplicationStatusAction(formData: FormData) {
  return runAdminAction(admin => updateFriendApplicationStatus(admin, formData))
}

export async function approveFriendApplicationAction(formData: FormData) {
  return runAdminAction(admin => approveFriendApplication(admin, formData))
}

export async function saveHomeSectionAction(formData: FormData) {
  return runAdminAction(admin => saveHomeSection(admin, formData))
}

export async function uploadMedia(formData: FormData) {
  return runAdminAction(admin => uploadAdminMedia(admin, formData))
}

export async function deleteMedia(formData: FormData) {
  return runAdminAction(admin => deleteAdminMedia(admin, formData))
}
