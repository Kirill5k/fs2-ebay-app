import {Select, Space, Form, Slider} from 'antd'

const StockSelectFilter = ({items, value, placeHolder, onChange}) => {
  return (
      <Select
          size="small"
          mode="multiple"
          allowClear
          style={{width: '100%'}}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          options={items.map(r => ({label: r, value: r}))}
      />
  )
}

const StockFilters = ({options, selections, onChange}) => {
  return (
      <Space style={{width: '100%'}} direction="vertical">
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
            onChange={d => onChange({...selections, discount: { min: d[0], max: d[1]}})}
        />
      </Space>
  )
}

export default StockFilters