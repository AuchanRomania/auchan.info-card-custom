import classNames from 'classnames'
import PropTypes, { bool, string, oneOf } from 'prop-types'
import React, { memo } from 'react'
import { values } from 'ramda'
import { injectIntl } from 'react-intl'
import {
  Helmet,
  useRuntime,
  useExperimentalLazyImagesContext,
} from 'vtex.render-runtime'
import { formatIOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'
import RichText from 'vtex.rich-text/index'

import BannerVideo from './BannerVideo'
import CallToAction from './CallToAction'
import LinkWrapper from './LinkWrapper'
import {
  textPositionTypes,
  textAlignmentTypes,
  callToActionModeTypes,
  textPostionValues,
  textAlignmentValues,
  textModeTypes,

} from './SchemaTypes'
import { SanitizedHTML } from '../SanitizedHTML'
import styles from './styles.css'

const ALLOWED_TAGS = ['p', 'span', 'a', 'div', 'br']
const ALLOWED_ATTRS = {
  a: ['class', 'href', 'title', 'target'],
  span: ['class'],
  p: ['class'],
  div: ['class'],
}

const justifyTokens = {
  [textPostionValues.LEFT]: 'justify-start',
  [textPostionValues.CENTER]: 'justify-center',
  [textPostionValues.RIGHT]: 'justify-end',
}

const alignTokens = {
  [textAlignmentValues.LEFT]: 'tl',
  [textAlignmentValues.CENTER]: 'tc',
  [textAlignmentValues.RIGHT]: 'tr',
}

const itemsTokens = {
  [textAlignmentValues.LEFT]: 'items-start',
  [textAlignmentValues.CENTER]: 'items-center',
  [textAlignmentValues.RIGHT]: 'items-end',
}

const flexOrderTokens = {
  [textPostionValues.LEFT]: 'flex-row',
  [textPostionValues.RIGHT]: 'flex-row-reverse',
}

const defaultValues = {
  textPosition: textPositionTypes.TEXT_POSITION_LEFT.value,
  textAlignment: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
}

const getEnumValues = enumObject => values(enumObject).map(({ value }) => value)
const getEnumNames = enumObject => values(enumObject).map(({ name }) => name)

const safelyGetToken = (tokenMap, valueWanted, propName) =>
  tokenMap[valueWanted] || defaultValues[propName]

const getImageUrl = (isMobile, imageUrl, mobileImageUrl) =>
  !!mobileImageUrl && isMobile ? mobileImageUrl : imageUrl

const isPriorityImage = (priority, isDuplicated) => !!priority && !isDuplicated

const toPlainText = text =>
  (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*#`]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const RESIZABLE_IMAGE = /\.vtexassets\.com\/assets\/vtex\.file-manager-graphql\/images\//
const SRCSET_WIDTHS = [
  160, 240, 320, 400, 480, 640, 800, 1024, 1280, 1600, 1920, 2560,
]
const FALLBACK_WIDTH = 1280
const PHONE_MAX_WIDTH = 1024

const getResizedUrl = (url, width) =>
  `${url}${url.includes('?') ? '&' : '?'}width=${width}&aspect=true`

const getResponsiveImage = (url, priority, sizes, useAutoSizes, maxWidth) => {
  if (priority === undefined || priority === null || !RESIZABLE_IMAGE.test(url)) {
    return { src: url }
  }

  const widths = SRCSET_WIDTHS.filter(width => width <= maxWidth)

  return {
    src: getResizedUrl(url, Math.min(FALLBACK_WIDTH, maxWidth)),
    srcSet: widths.map(width => `${getResizedUrl(url, width)} ${width}w`).join(', '),
    sizes: useAutoSizes ? `auto, ${sizes}` : sizes,
  }
}

const getImageLoadingProps = (priority, isDuplicated) => {
  if (priority === undefined || priority === null) {
    return { fetchpriority: 'high', 'data-vtex-preload': 'true' }
  }

  if (isPriorityImage(priority, isDuplicated)) {
    return {
      loading: 'eager',
      fetchpriority: 'high',
      crossOrigin: 'anonymous',
    }
  }

  return { loading: 'lazy', decoding: 'async' }
}

const toPositiveNumber = (value) => {
  const number = Number(value)

  return Number.isFinite(number) && number > 0 ? number : undefined
}

const CSS_HANDLES = [
  'infoCardImageLinkWrapper',
  'infoCardContainer',
  'infoCardTextContainer',
  'infoCardHeadline',
  'infoCardSubhead',
  'infoCardBodyText',
  'infoCardImageContainer',
  'infoCardImage',
]

const InfoCard = ({
  isFullModeStyle,
  headline,
  subhead,
  bodyText,
  callToActionMode,
  callToActionText,
  callToActionUrl,
  callToActionLinkTarget,
  textPosition,
  textAlignment,
  imageUrl,
  mobileImageUrl,
  imageActionUrl,
  imageAltText,
  intl,
  htmlId,
  textMode,
  linkTarget,
  priority,
  imageWidth,
  imageHeight,
  mobileImageWidth,
  mobileImageHeight,
  imageSizes,
  mobileImageSizes,
  videoUrl,
  mobileVideoUrl,
  __isDuplicated,
}) => {


  const {
    hints: { mobile, phone },
  } = useRuntime()

  const { lazyLoad } = useExperimentalLazyImagesContext()

  const { handles } = useCssHandles(CSS_HANDLES)
  const paddingClass =
    textPosition === textPostionValues.LEFT ? 'pr4-ns' : 'pl4-ns'

  // We ignore textAlignment tokens when full image mode
  const alignToken = isFullModeStyle
    ? safelyGetToken(alignTokens, textPosition, 'textPosition')
    : safelyGetToken(alignTokens, textAlignment, 'textAlignment')

  const itemsToken = isFullModeStyle
    ? safelyGetToken(itemsTokens, textPosition, 'textPosition')
    : safelyGetToken(itemsTokens, textAlignment, 'textAlignment')

  const justifyToken = safelyGetToken(
    justifyTokens,
    textPosition,
    'textPosition'
  )

  const flexOrderToken = safelyGetToken(
    flexOrderTokens,
    textPosition,
    'textPosition'
  )

  const formattedImageUrl = formatIOMessage({ id: imageUrl, intl })
  const formattedMobileImageUrl = formatIOMessage({ id: mobileImageUrl, intl })
  const isMobileAsset = !!formattedMobileImageUrl && !!mobile

  const finalImageUrl = getImageUrl(
    mobile,
    formattedImageUrl,
    formattedMobileImageUrl
  )

  const finalImageWidth = toPositiveNumber(
    isMobileAsset ? mobileImageWidth : imageWidth
  )

  const finalImageHeight = toPositiveNumber(
    isMobileAsset ? mobileImageHeight : imageHeight
  )

  const formattedVideoUrl = formatIOMessage({ id: videoUrl, intl })
  const formattedMobileVideoUrl = formatIOMessage({ id: mobileVideoUrl, intl })

  const finalVideoUrl = mobile
    ? formattedMobileVideoUrl || (!isMobileAsset ? formattedVideoUrl : '')
    : formattedVideoUrl

  const formattedCallToActionText = formatIOMessage({
    id: callToActionText,
    intl,
  })

  const headlineText = toPlainText(formatIOMessage({ id: headline, intl }))

  const imageAlt =
    formatIOMessage({ id: imageAltText, intl }) ||
    formattedCallToActionText ||
    (formatIOMessage({ id: imageActionUrl, intl }) ? headlineText : '')

  const containerStyle = isFullModeStyle
    ? {
      /* If lazyloaded, the background image comes from the `data-bg` attribute
       * below. Otherwise, sets it here as background-image */
      ...(!lazyLoad && { backgroundImage: `url(${finalImageUrl})` }),
      backgroundSize: 'cover',
    }
    : {}

  const containerAttributes =
    isFullModeStyle && lazyLoad ? { 'data-bg': finalImageUrl } : {}

  const containerClasses = classNames(
    `${handles.infoCardContainer} items-center`,
    {
      [`flex-ns ${flexOrderToken} bg-base ph2-ns pb2 justify-between`]:
        !isFullModeStyle,
      [`bg-center bb b--muted-4 flex ${justifyToken}`]: isFullModeStyle,
      lazyload: lazyLoad,
    }
  )

  const linkWrapperClasses = `${handles.infoCardImageLinkWrapper} no-underline`

  const textContainerClasses = classNames(
    `${handles.infoCardTextContainer} flex flex-column mw-100`,
    {
      [`w-50-ns ph3-s ${itemsToken} ${paddingClass}`]: !isFullModeStyle,
      [`mh8-ns mh4-s w-40-ns ${itemsToken}`]: isFullModeStyle,
    }
  )

  const headlineClasses = `${handles.infoCardHeadline} t-heading-2 mt6 ${alignToken} c-on-base mw-100`

  const subheadClasses = `${handles.infoCardSubhead} t-body mt6 c-on-base ${alignToken} mw-100`

  const bodyTextClasses = `${handles.infoCardBodyText} t-body mt6 c-on-base ${alignToken} mw-100`

  const imageStyle =
    finalImageWidth && finalImageHeight
      ? {
        objectFit: 'cover',
        height: 'auto',
        aspectRatio: `${finalImageWidth} / ${finalImageHeight}`,
      }
      : { objectFit: 'cover' }

  const loadingProps = getImageLoadingProps(priority, __isDuplicated)

  const finalImageSizes =
    (mobile ? mobileImageSizes || imageSizes : imageSizes) || '100vw'

  // `sizes="auto"` makes the browser apply `contain: size` with a 300x150 fallback,
  // so it is only safe when the image has width and height to keep its ratio
  const responsiveImage = getResponsiveImage(
    finalImageUrl,
    priority,
    finalImageSizes,
    loadingProps.loading === 'lazy' && !!finalImageWidth && !!finalImageHeight,
    phone ? PHONE_MAX_WIDTH : Infinity
  )

  const image = (
    <img
      className={handles.infoCardImage}
      {...responsiveImage}
      style={imageStyle}
      alt={imageAlt}
      data-testid="half-image"
      width={finalImageWidth}
      height={finalImageHeight}
      {...loadingProps}
    />
  )

  const preload =
    !isFullModeStyle &&
      finalImageUrl &&
      isPriorityImage(priority, __isDuplicated) ? (
      <Helmet>
        <link
          rel="preload"
          as="image"
          href={responsiveImage.src}
          {...(responsiveImage.srcSet && {
            imagesrcset: responsiveImage.srcSet,
            imagesizes: responsiveImage.sizes,
          })}
          fetchpriority="high"
          crossOrigin="anonymous"
        />
      </Helmet>
    ) : null

  return (
    <LinkWrapper
      imageActionUrl={formatIOMessage({ id: imageActionUrl, intl })}
      extraCondition={!isFullModeStyle}
      linkProps={{ className: linkWrapperClasses, target: linkTarget }}
    >
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid="container"
        id={htmlId}
        {...containerAttributes}
      >
        {preload}
        <div className={textContainerClasses}>
          {headline &&
            (textMode === 'html' ? (
              <div className={headlineClasses}>
                <SanitizedHTML
                  content={formatIOMessage({ id: headline, intl })}
                  allowedTags={ALLOWED_TAGS}
                  allowedAttributes={ALLOWED_ATTRS}
                />
              </div>
            ) : (
              <RichText className={headlineClasses} text={headline} />
            ))}
          {subhead &&
            (textMode === 'html' ? (
              <div className={subheadClasses}>
                <SanitizedHTML
                  content={formatIOMessage({ id: subhead, intl })}
                  allowedTags={ALLOWED_TAGS}
                  allowedAttributes={ALLOWED_ATTRS}
                />
              </div>
            ) : (
              <RichText className={subheadClasses} text={subhead} />
            ))}
          {bodyText &&
            (textMode === 'html' ? (
              <div className={bodyTextClasses}>
                <SanitizedHTML
                  content={formatIOMessage({ id: bodyText, intl })}
                  allowedTags={ALLOWED_TAGS}
                  allowedAttributes={ALLOWED_ATTRS}
                />
              </div>
            ) : (
              <RichText className={bodyTextClasses} text={bodyText} />
            ))}
          <CallToAction
            mode={callToActionMode}
            text={formattedCallToActionText}
            label={headlineText}
            url={formatIOMessage({ id: callToActionUrl, intl })}
            linkTarget={callToActionLinkTarget}
          />
        </div>
        {!isFullModeStyle && (
          <div className={`${handles.infoCardImageContainer} w-50-ns`}>
            <LinkWrapper
              imageActionUrl={formatIOMessage({ id: imageActionUrl, intl })}
              linkProps={{ target: linkTarget }}
            >
              {finalVideoUrl ? (
                <span className={styles.infoCardVideoFrame}>
                  {image}
                  <BannerVideo
                    src={finalVideoUrl}
                    width={finalImageWidth}
                    height={finalImageHeight}
                  />
                </span>
              ) : (
                image
              )}
            </LinkWrapper>
          </div>
        )}
      </div>
    </LinkWrapper>
  )
}

const MemoizedInfoCard = memo(injectIntl(InfoCard))

MemoizedInfoCard.propTypes = {
  blockClass: string,
  isFullModeStyle: bool,
  textPosition: oneOf(getEnumValues(textPositionTypes)),
  headline: string,
  subhead: string,
  bodyText: string,
  callToActionMode: oneOf(getEnumValues(callToActionModeTypes)),
  callToActionText: string,
  callToActionUrl: string,
  imageUrl: string,
  mobileImageUrl: string,
  textAlignment: oneOf(getEnumValues(textAlignmentTypes)),
  imageActionUrl: string,
  imageAltText: string,
  intl: PropTypes.object,
  htmlId: string,
  textMode: oneOf(getEnumValues(textModeTypes)),
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
  linkTarget: oneOf(['_self', '_blank', '_parent', '_top']),
  callToActionLinkTarget: oneOf(['_self', '_blank', '_parent', '_top']),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  priority: bool,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  mobileImageWidth: PropTypes.number,
  mobileImageHeight: PropTypes.number,
  imageSizes: string,
  mobileImageSizes: string,
  videoUrl: string,
  mobileVideoUrl: string,
}

MemoizedInfoCard.defaultProps = {
  isFullModeStyle: false,
  textPosition: textPositionTypes.TEXT_POSITION_LEFT.value,
  headline: '',
  subhead: '',
  bodyText: '',
  callToActionMode: callToActionModeTypes.CALL_ACTION_BUTTON.value,
  callToActionText: '',
  callToActionUrl: '',
  imageUrl: '',
  mobileImageUrl: '',
  imageAltText: '',
  textAlignment: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
  textMode: textModeTypes.TEXT_MODE_HTML.value,
  linkTarget: '_self',
  callToActionLinkTarget: '_self',
  videoUrl: '',
  mobileVideoUrl: '',
  startDate: '',
  endDate: '',
}

MemoizedInfoCard.schema = {
  title: 'admin/editor.info-card.title',
  description: 'admin/editor.info-card.description',
  type: 'object',
  properties: {
    isFullModeStyle: {
      title: 'admin/editor.info-card.isFullModeStyle.title',
      description: 'admin/editor.info-card.isFullModeStyle.description',
      type: 'boolean',
      default: false,
      isLayout: true,
    },
    textPosition: {
      title: 'admin/editor.info-card.textPosition.title',
      description: 'admin/editor.info-card.textPosition.description',
      type: 'string',
      enum: getEnumValues(textPositionTypes),
      enumNames: getEnumNames(textPositionTypes),
      default: textPositionTypes.TEXT_POSITION_LEFT.value,
      isLayout: true,
    },
    callToActionMode: {
      title: 'admin/editor.info-card.callToActionMode.title',
      description: 'admin/editor.info-card.callToActionMode.description',
      type: 'string',
      enum: getEnumValues(callToActionModeTypes),
      enumNames: getEnumNames(callToActionModeTypes),
      default: callToActionModeTypes.CALL_ACTION_BUTTON.value,
      isLayout: true,
    },
    textAlignment: {
      title: 'admin/editor.info-card.textAlignment.title',
      description: 'admin/editor.info-card.textAlignment.description',
      type: 'string',
      default: textAlignmentTypes.TEXT_ALIGNMENT_LEFT.value,
      enum: getEnumValues(textAlignmentTypes),
      enumNames: getEnumNames(textAlignmentTypes),
      isLayout: true,
    },
    textMode: {
      title: 'admin/editor.info-card.textMode.title',
      description: 'admin/editor.info-card.textMode.description',
      type: 'string',
      default: textModeTypes.TEXT_MODE_HTML.value,
      enum: getEnumValues(textModeTypes),
      enumNames: getEnumNames(textModeTypes),
      isLayout: true,
    },
    blockClass: {
      title: 'admin/editor.blockClass.title',
      description: 'admin/editor.blockClass.description',
      type: 'string',
      isLayout: true,
    },
    startDate: {
      title: 'admin/editor.info-card.startDate.title',
      description: 'admin/editor.info-card.startDate.description',
      type: 'string',
      format: 'date-time'
    },
    endDate: {
      title: 'admin/editor.info-card.endDate.title',
      description: 'admin/editor.info-card.endDate.description',
      type: 'string',
      format: 'date-time'
    }
  },
}

export default MemoizedInfoCard
