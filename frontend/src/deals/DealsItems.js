import {Card, Collapse, Descriptions, List, Tag} from 'antd'
import './DealsItems.css'

const DealsItemList = ({items}) => (
    <div style={{maxHeight: 300, overflow: 'auto'}}>
      <List
          dataSource={Array.from(items.items.entries())}
          renderItem={([i, item]) => (
              <Card
                  key={item.url}
                  className="deals-item"
                  hoverable
                  onClick={() => window.open(item.url, "_blank")}
              >
                <Descriptions column={1}>
                  <Descriptions.Item label="Name">
                    {item.name}
                    <Tag bordered={false}>{i+1}</Tag>
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
    </div>
)

const DealsItems = ({items}) => (
    <Collapse
        className="test"
        defaultActiveKey="1"
        accordion
        ghost
        style={{width: '660px'}}
    >
      <Collapse.Panel
          header="Without sell price"
          extra={<Tag>{items.unrecognized.total}</Tag>}
          key="1"
      >
        <DealsItemList items={items.unrecognized}/>
      </Collapse.Panel>
      <Collapse.Panel
          header="Profitable to resell"
          extra={<Tag>{items.profitable.total}</Tag>}
          key="2"
      >
        <DealsItemList items={items.profitable}/>
      </Collapse.Panel>
      <Collapse.Panel
          header="Remaining"
          extra={<Tag>{items.rest.total}</Tag>}
          key="3"
      >
        <DealsItemList items={items.rest}/>
      </Collapse.Panel>
    </Collapse>
)

export default DealsItems