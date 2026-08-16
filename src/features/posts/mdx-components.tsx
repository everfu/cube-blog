import type { ComponentPropsWithoutRef } from 'react'
import {
  ArticleBlockquote,
  ArticleHeading2,
  ArticleHeading3,
  ArticleHeading4,
  ArticleListItem,
  ArticleParagraph,
} from '@/features/posts/ArticleCommentBlocks'
import { ArticleCodeBlock } from '@/features/posts/ArticleCodeBlock'
import { ArticleImage } from '@/features/posts/ArticleImage'

export const mdxComponents = {
  p: ArticleParagraph,
  h2: ArticleHeading2,
  h3: ArticleHeading3,
  h4: ArticleHeading4,
  blockquote: ArticleBlockquote,
  li: ArticleListItem,
  pre: ArticleCodeBlock,
  img: ArticleImage,
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      {...props}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noreferrer' : undefined}
    />
  ),
}
