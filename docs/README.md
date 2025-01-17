# InfoCardCustom Component

The `InfoCardCustom` component is designed to display content conditionally based on specific date and time intervals. This component is customizable and can be used as part of a VTEX framework project.

## Features

- **Date-based Visibility:**
  - The component has `startDate` and `endDate` properties to control its visibility.
  - If the current date is not within the specified interval, the component is hidden (`display: none`).

- **Schema Integration:**
  - The `startDate` and `endDate` fields support calendar and time-based inputs (`date-time` format).
  - These properties can be configured in the VTEX admin interface.
