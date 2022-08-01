import React from 'react'

type Props = {
  fill?: string
  styleClass?: string
}

function AnnounceClose({ fill, styleClass }: Props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styleClass}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.12224 5.12204C5.28522 4.95932 5.54947 4.95932 5.71246 5.12204L14.8778 14.2642C15.0407 14.4269 15.0407 14.6907 14.8778 14.8534C14.7148 15.0161 14.4505 15.0161 14.2875 14.8534L5.12224 5.71129C4.95925 5.54858 4.95925 5.28476 5.12224 5.12204Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.12224 14.878C4.95925 14.7152 4.95925 14.4514 5.12224 14.2887L14.2875 5.14657C14.4505 4.98385 14.7148 4.98385 14.8778 5.14657C15.0407 5.30929 15.0407 5.5731 14.8778 5.73582L5.71246 14.878C5.54947 15.0407 5.28522 15.0407 5.12224 14.878Z"
        fill={fill}
      />
    </svg>
  )
}

AnnounceClose.defaultProps = {
  fill: '#fff',
}

export default AnnounceClose
