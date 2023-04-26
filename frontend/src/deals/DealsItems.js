import InfiniteScroll from 'react-infinite-scroll-component'
import {Card, Descriptions, List} from 'antd'
import './DealsItems.css'

const DealsItems = ({items}) => (
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
              <Card key={item.url} size="small" className="deals-item">
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
                    £{item.buyPrice} (Buy) {item.exchangePrice ? `/ £${item.exchangePrice} (Sell)` : ''}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
          )}
      />
    </InfiniteScroll>
)

export default DealsItems