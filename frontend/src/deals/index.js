import React from 'react'
import {useSelector} from 'react-redux'
import {DatePicker, Descriptions, List, Card} from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import Container from '../common/components/Container'
import {endOfToday, startOfToday} from '../common/functions/dates'

const ItemsList = ({items}) => (
    <InfiniteScroll
        dataLength={items.total}
        hasMore={false}
        loader={<h4>Loading...</h4>}
        endMessage={<span></span>}
        height={300}
    >
      <List
          dataSource={items.items}
          renderItem={(item) => (
              <Card key={item.url} size="small">
                <Descriptions
                    size="small"
                    column={1}
                >
                  <Descriptions.Item label="Name">
                    {item.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Listing Title">
                    {item.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    {item.buyPrice} (Buy) {item.exchangePrice ? `/ ${item.exchangePrice} (Sell)` : ''}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
          )}
      />
    </InfiniteScroll>
)

const Deals = ({backgroundColor}) => {

  const items = useSelector(state => state.deals.items)

  return (
      <Container
          column
          style={{
            padding: '24px 24px',
            background: backgroundColor
          }}>
        <DatePicker.RangePicker
            defaultValue={[startOfToday(), endOfToday()]}
            onChange={(v) => console.log(v.map(d => d.toDate().toISOString()))}
            showTime
        />
        <ItemsList items={items.unrecognized}/>
      </Container>
  )
}

export default Deals