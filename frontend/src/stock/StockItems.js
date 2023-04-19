import {Card, List, Descriptions} from 'antd';
import './StockItems.css'

const grid = {
  gutter: 16,
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 5,
}

const StockItem = ({item}) => {
  if (item.itemDetails.kind === 'clothing') {
    return (
        <List.Item className="stock-item">
          <Card
              onClick={() => window.open(item.listingDetails.url, "_blank")}
              style={{ width: '200px' }}
              hoverable
              cover={
                <img
                    className="image"
                    alt={item.listingDetails.title}
                    src={item.listingDetails.image}
                />
              }
          >
            <Descriptions
                title={item.itemDetails.name}
                column={1}
                size="small"
                labelStyle={{ fontSize: '10px' }}
                contentStyle={{ fontSize: '10px' }}
            >
              <Descriptions.Item label="Brand">{item.itemDetails.brand}</Descriptions.Item>
              <Descriptions.Item label="Size">{item.itemDetails.size}</Descriptions.Item>
              <Descriptions.Item label="Price">
                £{item.price.buy}
                {item.price.discount ? <span className="discount">{`(-${item.price.discount}%)`}</span> : ''}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">{item.price.quantityAvailable}</Descriptions.Item>
              <Descriptions.Item label="Retailer">{item.listingDetails.seller}</Descriptions.Item>
            </Descriptions>
          </Card>
        </List.Item>
    )
  }

  return null;
}

const StockItems = ({items}) => {
  return (
      <List
          className="stock-items"
          pagination={{ position: 'both', align: 'center' }}
          grid={grid}
          dataSource={items}
          renderItem={(item) => <StockItem item={item}/> }
      />
  )
}

export default StockItems