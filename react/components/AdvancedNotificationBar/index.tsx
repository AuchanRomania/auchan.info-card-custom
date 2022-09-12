import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { Link, useRuntime } from 'vtex.render-runtime'
import { CssHandlesList } from 'vtex.css-handles/react/CssHandlesTypes'
import { useApolloClient } from 'react-apollo'
import { useFullSession } from 'vtex.session-client'
import axios from 'axios'

import { findMatchingCategory, getColorScheme } from '../../utils'
import GET_CAT_TREE from '../../graphql/getCategoryTree.gql'
import AnnounceClose from './icons/AnnounceClose'
import AnnounceRight from './icons/AnnounceRight'
import AnnounceInfo from './icons/AnnounceInfo'

const CSS_HANDLES = [
  'notificationBarContainer',
  'notificationImageContainer',
  'notificationImage',
  'notificationBarInner',
  'notificationContent',
  'notificationText',
  'notificationCloseButton',
  'notificationLink',
  'notificationLinkText',
  'notificationBarIcon',
  'notificationCloseIcon',
  'notificationArrowRight',
] as const

interface Seller {
  id: string
}

interface Props {
  content?: string
  color?: string
  link?: string
  linkText?: string
  icon?: string
  notifBarIdx?: number
  categoryID?: string
  sellerID?: string
  blockClass?: string
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function AdvancedNotificationBar({
  content,
  color,
  link,
  linkText,
  icon,
  notifBarIdx,
  categoryID,
  sellerID,
  blockClass,
  classes,
}: Props) {
  const { data, error } = useFullSession()
  const [addressSellers, setAddressSellers] = useState([])

  if (error) {
    console.error('Notification list session error', error)
  }

  const regionID = data?.session?.namespaces?.public?.regionId?.value

  useEffect(() => {
    if (!regionID) {
      return
    }

    axios
      .get(`/api/checkout/pub/regions/${regionID}`)
      .then((response: any) => {
        setAddressSellers(response?.data[0]?.sellers)
      })
      .catch((e) => {
        console.error('Get Sellers api call error', e)
      })
  }, [regionID])

  const { route } = useRuntime()
  const client = useApolloClient()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const [show, setShow] = useState(false)
  const [matchCategory, setMatchCategory] = useState(false)
  const [matchSeller, setMatchSeller] = useState(false)

  const pageID = route?.pageContext?.id

  // Custom CSS class set from Admin for each announcement bar to differentiate them
  const block = ([blockClass] as CssHandlesList) ?? ([''] as CssHandlesList)
  const { handles: customBlockClass } = useCssHandles(block)
  const cssBlockClass = customBlockClass[Object.keys(customBlockClass)[0]]

  const handleClose = () => {
    window?.sessionStorage?.setItem(
      `closeNotificationBar-${notifBarIdx?.toString()}`,
      'true'
    )
    setShow(false)
  }

  const handleMatchCategory = async (catID: string) => {
    const result = await client.query({
      query: GET_CAT_TREE,
    })

    // matchedCategory finds the id from admin props to an id in any category; matches the current page id to the
    // department / category / subcategory set in admin
    const matchedCategory = findMatchingCategory(
      result?.data?.categories,
      String(catID)
    )

    if (!matchedCategory) {
      return false
    }

    // check if the admin category matches the page id
    if (String(matchedCategory?.id) === String(pageID)) {
      return true
    }

    // matchChildren checks if the current page id is found in the matched category or any of its children
    const matchChildren = findMatchingCategory(
      matchedCategory?.children,
      pageID
    )

    if (!matchChildren) {
      return false
    }

    return true
  }

  const handleMatchSeller = async (sellID: string, sellers: Seller[]) => {
    if (sellers.find((seller: Seller) => seller?.id === sellID)) {
      return true
    }

    return false
  }

  useEffect(() => {
    if (
      window?.sessionStorage?.getItem(
        `closeNotificationBar-${notifBarIdx?.toString()}`
      )
    ) {
      return
    }

    if (!categoryID && !sellerID) {
      setShow(true)

      return
    }

    if (categoryID && !window.isNaN(Number(categoryID))) {
      handleMatchCategory(categoryID).then((result) => {
        setMatchCategory(result)
      })
    }

    if (sellerID) {
      handleMatchSeller(sellerID, addressSellers).then((result) => {
        setMatchSeller(result)
      })
    }
  }, [categoryID, client, notifBarIdx, pageID, sellerID, addressSellers])

  useEffect(() => {
    if (categoryID && sellerID) {
      setShow(matchCategory && matchSeller)
    } else if (!categoryID && sellerID) {
      setShow(matchSeller)
    } else if (categoryID && !sellerID) {
      setShow(matchCategory)
    }
  }, [categoryID, matchCategory, matchSeller, sellerID])

  if (!content) {
    return null
  }

  const hasLink = link && linkText
  const { background, iconBackground, fill, secondaryTheme } = getColorScheme(
    color
  )

  const textColor = secondaryTheme ? '#775800' : '#fff'

  if (!show) {
    return null
  }

  return (
    <div
      className={`${handles.notificationBarContainer} ${cssBlockClass} w-100 pv3 flex items-center`}
      style={{ backgroundColor: background, height: '4.25rem' }}
    >
      <div
        className={`${handles.notificationBarInner} w-100 flex pr5 justify-start`}
      >
        <div
          style={{
            backgroundColor: iconBackground,
            borderRadius: '0 6.25rem 6.25rem 0',
            minWidth: '2.875rem',
            minHeight: '2.875rem',
          }}
          className={`${handles.notificationImageContainer} mr4 pa3 flex justify-center`}
        >
          {icon !== '' ? (
            <img
              src={icon}
              alt="barIcon"
              width={24}
              className={`${handles.notificationImage} mr2 mt2`}
            />
          ) : (
            <AnnounceInfo
              fill={fill}
              styleClass={handles.notificationBarIcon}
              size="30"
              viewBox="0 0 20 20"
            />
          )}
        </div>

        <div
          className={`${handles.notificationContent} flex flex-column`}
          style={{ maxWidth: 'max-content', justifyContent: 'space-evenly' }}
        >
          <p
            style={{ color: textColor }}
            className={`${handles.notificationText} link f6 fw4 lh-solid tl ma0 flex items-center`}
          >
            {content !== '' ? content : 'Announcement bar text content'}
          </p>
          {hasLink && (
            <Link
              to={link}
              style={{ width: 'fit-content' }}
              className={`${handles.notificationLink} flex items-center`}
            >
              <p
                style={{ color: textColor }}
                className={`${handles.notificationLinkText} f7 b lh-solid tl underline ttu ma0`}
              >
                {linkText}
              </p>
              <AnnounceRight
                fill={fill}
                styleClass={handles.notificationArrowRight}
              />
            </Link>
          )}
        </div>

        <div style={{ flexGrow: 1 }} />

        <button
          onClick={() => handleClose()}
          className={`${handles.notificationCloseButton} bg-transparent bn pointer flex`}
        >
          <AnnounceClose
            fill={fill}
            styleClass={handles.notificationCloseIcon}
          />
        </button>
      </div>
    </div>
  )
}

AdvancedNotificationBar.schema = {
  title: 'admin/editor.notification-bar.title',
}

export default AdvancedNotificationBar
