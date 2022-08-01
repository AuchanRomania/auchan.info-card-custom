import React from 'react'

type Props = {
  fill?: string
  styleClass?: string
}

function AnnounceRight({ fill, styleClass }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styleClass} ml2`}
    >
      <path
        d="M10.0978 11.5976C9.96762 11.7278 9.96762 11.9389 10.0978 12.069C10.228 12.1992 10.439 12.1992 10.5692 12.069L14.5692 8.06904C14.6012 8.03708 14.6253 8.00024 14.6415 7.96093C14.6563 7.92518 14.6646 7.88738 14.6664 7.84932C14.6667 7.844 14.6668 7.83866 14.6668 7.83333C14.6668 7.78814 14.6578 7.74504 14.6415 7.70574C14.6253 7.66642 14.6012 7.62959 14.5692 7.59763L10.5692 3.59763C10.439 3.46746 10.228 3.46746 10.0978 3.59763C9.96762 3.72781 9.96762 3.93886 10.0978 4.06904L13.5288 7.5L1.66683 7.5C1.48273 7.5 1.3335 7.64924 1.3335 7.83333C1.3335 8.01743 1.48273 8.16667 1.66683 8.16667L13.5288 8.16667L10.0978 11.5976Z"
        fill={fill}
      />
    </svg>
  )
}

AnnounceRight.defaultProps = {
  fill: '#fff',
}

export default AnnounceRight
