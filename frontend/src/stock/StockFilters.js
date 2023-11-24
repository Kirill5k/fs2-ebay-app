import {Select, Space, Slider} from 'antd'
import './StockFilters.css'

const StockSelectFilter = ({items, value, placeHolder, onChange}) => {
  return (
      <Select
          size="small"
          mode="multiple"
          allowClear
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          className="stock-filter-select"
      >
        {items.map(i => (
            <Select.Option key={i} value={i} label={i}>
              <Space className="stock-filter-select-option">{i}</Space>
            </Select.Option>
        ))}
      </Select>
  )
}

const StockFilters = ({options, selections, onChange}) => {
  return (
      <Space className="stock-filters" direction="vertical">
        <StockSelectFilter
            items={options.kinds}
            value={selections.kinds}
            placeHolder="Item types"
            onChange={kinds => onChange({...selections, kinds})}
        />
        <StockSelectFilter
            items={options.retailers}
            value={selections.retailers}
            placeHolder="Retailers"
            onChange={retailers => onChange({...selections, retailers})}
        />
        <StockSelectFilter
            items={options.sizes}
            value={selections.sizes}
            placeHolder="Sizes"
            onChange={sizes => onChange({...selections, sizes})}
        />
        <StockSelectFilter
            items={options.brands}
            value={selections.brands}
            placeHolder="Brands"
            onChange={brands => onChange({...selections, brands})}
        />
        <Slider
            marks={{0: '0%', 100: '100%'}}
            range
            step={5}
            min={options.discount.min}
            max={options.discount.max}
            defaultValue={[options.discount.min, options.discount.max]}
            value={[selections.discount.min, selections.discount.max]}
            onChange={d => onChange({...selections, discount: {min: d[0], max: d[1]}})}
        />
      </Space>
  )
}

export default StockFilters