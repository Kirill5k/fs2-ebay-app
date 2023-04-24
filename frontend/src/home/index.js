import React from 'react'
import Container from '../common/components/Container'

const Home = ({backgroundColor}) => {
  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        <p>Home page content</p>
      </Container>
  )
}

export default Home