import React from 'react'
import Container from '../common/components/Container'

const Items = ({backgroundColor}) => {

  return (
      <Container
          padded
          column
          backgroundColor={backgroundColor}
          stretchItems
      >
      </Container>
  )
}

export default Items