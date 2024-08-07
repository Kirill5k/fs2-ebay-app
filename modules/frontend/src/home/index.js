import React from 'react'
import {useSelector} from 'react-redux'
import {Descriptions} from 'antd'
import Container from '../common/components/Container'
import Status from '../common/status'
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
        {dealsStatus === Status.SUCCEEDED && (
            <Descriptions title="Deals" column={column} items={[
              { key: '0', label: 'Total for today', children: dealsItems.total },
              { key: '1', label: 'Without exchange price', children: dealsItems.unrecognized.total },
              { key: '2', label: 'With buy price smaller than exchange', children: dealsItems.profitable.total }
            ]}/>
        )}
        {stockStatus === Status.SUCCEEDED && (
            <Descriptions title="Stock" column={column} items={[
              { key: '0', label: 'Total', children: stockItems.length },
              ...Object
                  .entries(countByProperty(stockItems, i => i.listingDetails.seller))
                  .map(([retailer, count]) => ({ key: retailer, label: retailer, children: count }))
            ]}/>
        )}
      </Container>
  )
}

export default Home