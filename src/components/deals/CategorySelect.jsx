import { Select } from '../BoostFundrUI'

const CategorySelect = ({ value, categories, onChange }) => {
  const options = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((category) => ({ value: category, label: category })),
  ]

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      className="min-w-[180px]"
    />
  )
}

export default CategorySelect
