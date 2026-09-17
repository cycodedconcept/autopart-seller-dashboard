import { useState } from 'react'
import PropTypes from 'prop-types'
import { validateSalesRange } from '../../utils/sales'

export default function SalesDateFilter({ dateFrom = '', dateTo = '', busy, onApply }) {
  const [values, setValues] = useState({ dateFrom, dateTo })
  const [errors, setErrors] = useState({})
  const submit = event => {
    event.preventDefault()
    const nextErrors = validateSalesRange(values)
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onApply(values)
  }
  return <form className="sales-date-filter" onSubmit={submit} noValidate aria-label="Sales date range">
    {['dateFrom', 'dateTo'].map(field => <div className="catalog-field" key={field}>
      <label htmlFor={'sales-' + field}>{field === 'dateFrom' ? 'Start date' : 'End date'}</label>
      <input id={'sales-' + field} type="date" value={values[field]} disabled={busy}
        onChange={event => { setValues({ ...values, [field]: event.target.value }); setErrors({}) }}
        aria-invalid={!!errors[field]} aria-describedby={errors[field] ? field + '-error' : undefined} />
      {errors[field] && <span className="catalog-field-error" id={field + '-error'}>{errors[field]}</span>}
    </div>)}
    <div className="catalog-actions"><button className="catalog-button" disabled={busy}>Apply dates</button>
      <button type="button" className="catalog-button secondary" disabled={busy} onClick={() => { setErrors({}); onApply({}) }}>Default period</button></div>
  </form>
}
SalesDateFilter.propTypes = { dateFrom: PropTypes.string, dateTo: PropTypes.string, busy: PropTypes.bool, onApply: PropTypes.func.isRequired }
