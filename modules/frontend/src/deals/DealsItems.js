import {Card, Collapse, Descriptions, List, Tag} from 'antd'
import './DealsItems.css'

const ItemName = ({index, name}) => (
    <span style={{width: '100%'}}>
      <span>{name}</span>
      <Tag bordered={false} style={{float: 'right'}}>{index}</Tag>
    </span>
)

const DealsItemList = ({items}) => {
  return (
      <div className="deals-item-list">
        <List
            dataSource={Array.from(items.items.entries())}
            renderItem={([i, item]) => (
                <Card
                    key={item.url}
                    className="deals-item"
                    hoverable
                    onClick={() => window.open(item.url, "_blank")}
                >
                  <Descriptions column={1} items={[
                    { key: `n-${i}`, label: 'Name', children: <ItemName name={item.name} index={i+1}/> },
                    { key: `lt-${i}`, label: 'Listing Title', children: item.title },
                    { key: `p-${i}`, label: 'Price', children: `£${item.buyPrice} (Buy) ${item.exchangePrice ? `/ £${item.exchangePrice} (Sell)` : ''}` },
                  ]}/>
                </Card>
            )}
        />
      </div>
  )
}

const DealsItems = ({items}) => {
  return (
      <Collapse
          className="deals-items"
          defaultActiveKey="1"
          accordion
          ghost
          items={[
            {
              key: '1',
              label: 'Without sell price',
              extra: <Tag>{items.unrecognized.total}</Tag>,
              children: <DealsItemList items={items.unrecognized}/>
            },
            {
              key: '2',
              label: 'Profitable to resell',
              extra: <Tag>{items.profitable.total}</Tag>,
              children: <DealsItemList items={items.profitable}/>
            },
            {
              key: '3',
              label: 'Remaining',
              extra: <Tag>{items.rest.total}</Tag>,
              children: <DealsItemList items={items.rest}/>
            }
          ]}
      />
  )
}

export default DealsItems