const UserInputField = ({// Props
  label,
  name,
  type = 'text',
  value,
  onChange,
  isValid,
  message,
  placeholder
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {isValid === true && <span>✅</span>}
      {isValid === false && <span className="error-text">{message} ❌</span>}
    </div>
  )
}

export default UserInputField
