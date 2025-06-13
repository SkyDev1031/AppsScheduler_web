import { NumericFormat } from 'react-number-format';

function NumberView({ value, color, prefix, suffix, left = 0, right = 0, decimal = 4, bold, size = 18 }) {
    const fontWeight = bold ? 'bold' : 'normal'
    return (
        <>
            <span style={{ color, fontWeight, marginRight: 2, marginLeft: left, fontSize: size }}>{prefix || ''}</span>
            <NumericFormat
                value={value === 0 ? "0.00" : parseFloat(value || 'None').toFixed(decimal)}
                decimalScale={decimal}
                thousandSeparator={','}
                style={{ color, fontWeight, fontSize: size }}
                displayType="text" />
            <span style={{ color, fontWeight, marginLeft: 2, marginRight: right, fontSize: size }}>{suffix || ''}</span>
        </>
    )
}
export default NumberView;