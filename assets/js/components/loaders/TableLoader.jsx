import React from 'react'
import ContentLoader from 'react-content-loader'

const TableLoader = () => (
  <ContentLoader
    height={160}
    width={400}
    speed={2}
    primaryColor="transparent"
    secondaryColor="black"
  >
    <circle cx="150" cy="86" r="8" />
    <circle cx="194" cy="86" r="8" />
    <circle cx="238" cy="86" r="8" />
  </ContentLoader>
)

export default TableLoader