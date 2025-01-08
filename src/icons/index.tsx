import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number
}

export const ExcelColored = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, ...props }, forwardRef) => {
    return (
      <svg
        {...props}
        ref={forwardRef}
        width={size}
        height={size}
        viewBox="0 0 32 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 0H10C8.89543 0 8 0.89543 8 2V26C8 27.1046 8.89543 28 10 28H30C31.1046 28 32 27.1046 32 26V2C32 0.89543 31.1046 0 30 0Z"
          fill="#2FB776"
        />
        <path
          d="M8 21H32V26C32 27.1046 31.1046 28 30 28H10C8.89543 28 8 27.1046 8 26V21Z"
          fill="url(#paint0_linear_322_3)"
        />
        <path d="M32 14H20V21H32V14Z" fill="#229C5B" />
        <path d="M32 7H20V14H32V7Z" fill="#27AE68" />
        <path d="M8 2C8 0.89543 8.89543 0 10 0H20V7H8V2Z" fill="#1D854F" />
        <path d="M20 7H8V14H20V7Z" fill="#197B43" />
        <path d="M20 14H8V21H20V14Z" fill="#1B5B38" />
        <path
          d="M8 10C8 8.3431 9.34315 7 11 7H17C18.6569 7 20 8.3431 20 10V22C20 23.6569 18.6569 25 17 25H8V10Z"
          fill="black"
          fill-opacity="0.3"
        />
        <path
          d="M16 5H2C0.89543 5 0 5.89543 0 7V21C0 22.1046 0.89543 23 2 23H16C17.1046 23 18 22.1046 18 21V7C18 5.89543 17.1046 5 16 5Z"
          fill="url(#paint1_linear_322_3)"
        />
        <path
          d="M13 19L10.1821 13.9L12.8763 9H10.677L9.01375 12.1286L7.37801 9H5.10997L7.81787 13.9L5 19H7.19931L8.97251 15.6857L10.732 19H13Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_322_3"
            x1="8"
            y1="24.5"
            x2="32"
            y2="24.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#163C27" />
            <stop offset="1" stop-color="#2A6043" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_322_3"
            x1="0"
            y1="14"
            x2="18"
            y2="14"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#185A30" />
            <stop offset="1" stop-color="#176F3D" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
ExcelColored.displayName = 'ExcelColoredIcon'
