import React from 'react'
import {useSelector} from 'react-redux'
import {Descriptions} from 'antd'
import Container from '../common/components/Container'
import {countByProperty} from '../common/functions/collections'

const Home = ({backgroundColor}) => {
  const stockStatus = useSelector(state => state.stock.status)
  const stockItems = useSelector(state => state.stock.items)
  const dealsStatus = useSelector(state => state.deals.status)
  const dealsItems = useSelector(state => state.deals.todayItems)

  const column = {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 5,
  }

  return (
      <Container
          column
          padded
          backgroundColor={backgroundColor}
          style={{minHeight: '300px'}}>
        {dealsStatus === 'succeeded' && (
            <Descriptions title="Deals" column={column}>
              <Descriptions.Item label="Total for today">
                {dealsItems.total}
              </Descriptions.Item>
              <Descriptions.Item label="Without exchange price">
                {dealsItems.unrecognized.total}
              </Descriptions.Item>
              <Descriptions.Item label="With buy price smaller than exchange">
                {dealsItems.profitable.total}
              </Descriptions.Item>
            </Descriptions>
        )}
        {stockStatus === 'succeeded' && (
            <Descriptions title="Stock" column={column}>
              <Descriptions.Item label="Total">
                {stockItems.length}
              </Descriptions.Item>
              {Object
                .entries(countByProperty(stockItems, i => i.listingDetails.seller))
                .map(([retailer, count]) => (
                  <Descriptions.Item label={retailer}>
                    {count}
                  </Descriptions.Item>
                ))
              }
            </Descriptions>
        )}
      </Container>
  )
}

export default Home