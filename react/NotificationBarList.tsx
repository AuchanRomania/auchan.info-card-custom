import React from 'react'
import { useListContext, ListContextProvider } from 'vtex.list-context'

import NotificationBar from './NotificationBar'

export type NotificationListSchema = Array<{
  [key: string]: any
}>

export interface NotificationListProps {
  notifications: NotificationListSchema
}

function NotificationBarList({ notifications }: NotificationListProps) {
  const { list } = useListContext() || []

  const imageListContent = notifications.map(({ ...props }, idx) => (
    <div key={JSON.stringify(props)}>
      <NotificationBar {...props} notifBarIdx={idx} />
    </div>
  ))

  const newListContextValue = list.concat(imageListContent)

  return (
    <>
      <ListContextProvider list={newListContextValue}>
        {newListContextValue.map((item: any) => {
          return item
        })}
      </ListContextProvider>
    </>
  )
}

NotificationBarList.schema = {
  title: 'admin/editor.notification-list.title',
  description: 'admin/editor.notification-list.description',
  type: 'object',
  properties: {
    notifications: {
      type: 'array',
      title: 'admin/editor.notification-list.title',
      items: {
        content: {
          title: 'admin/editor.notification-bar.content.title',
          description: 'admin/editor.notification-bar.content.description',
          $ref: 'app:vtex.native-types#/definitions/text',
          default: '',
        },
        color: {
          title: 'admin/editor.notification-bar.color.title',
          $ref: 'app:vtex.native-types#/definitions/text',
          enum: ['Dark Blue', 'Green', 'Red', 'Light Blue', 'Yellow', 'Orange'],
          widget: {
            'ui:widget': 'select',
          },
          default: '',
        },
        link: {
          title: 'admin/editor.notification-bar.link.title',
          $ref: 'app:vtex.native-types#/definitions/url',
          default: '',
        },
        linkText: {
          title: 'admin/editor.notification-bar.linkText.title',
          $ref: 'app:vtex.native-types#/definitions/text',
          default: '',
        },
        icon: {
          title: 'admin/editor.notification-bar.icon.title',
          $ref: 'app:vtex.native-types#/definitions/url',
          default: '',
          widget: {
            'ui:widget': 'image-uploader',
          },
        },
        categoryID: {
          title: 'admin/editor.notification-bar.categoryID.title',
          $ref: 'app:vtex.native-types#/definitions/text',
          default: '',
        },
        sellerIDs: {
          title: 'admin/editor.notification-bar.sellerIDs.title',
          $ref: 'app:vtex.native-types#/definitions/text',
          default: '',
        },
        blockClass: {
          title: 'admin/editor.notification-bar.blockClass.title',
          $ref: 'app:vtex.native-types#/definitions/text',
          default: '',
        },
      },
    },
  },
}

export default NotificationBarList
