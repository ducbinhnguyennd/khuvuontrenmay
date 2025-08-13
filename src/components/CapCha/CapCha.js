/* eslint-disable react-hooks/exhaustive-deps */
import { getApiUrl } from '../../api'
import { useEffect, useState } from 'react'
import './CapCha.css'

function CapCha ({
  captcha,
  setCaptcha,
  captchaInput,
  setCaptchaInput,
  onFetch
}) {
  const [captchaStyles, setCaptchaStyles] = useState([])

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const fetchCaptcha = async () => {
    const res = await fetch(`${getApiUrl('backend')}/randomso`)
    const data = await res.json()
    setCaptcha(data.randomnumber)

    const styles = data.randomnumber.split('').map(() => ({
      transform: `rotate(${Math.random() * 40 - 20}deg) scale(${
        0.8 + Math.random() * 0.5
      })`,
      margin: `${Math.random() * 2}px`,
      fontSize: `${14 + Math.random() * 8}px`,
      color: `hsl(${Math.random() * 360}, 80%, 40%)`,
      fontWeight: 'bold',
      display: 'inline-block'
    }))
    setCaptchaStyles(styles)

    setCaptchaInput('')
  }

  useEffect(() => {
    if (onFetch) onFetch(fetchCaptcha)
  }, [onFetch])

  return (
    <div className='input-group captcha-row'>
      <span className='icon'>🔢</span>
      <input
        type='text'
        placeholder='Nhập mã captcha'
        value={captchaInput}
        maxLength={6}
        onChange={e => {
          const value = e.target.value
          if (/^[0-9]*$/.test(value)) {
            setCaptchaInput(value)
          }
        }}
        className='captcha-input'
      />
      <div className='captcha-box-small'>
        {captcha.split('').map((num, i) => (
          <span key={i} style={captchaStyles[i] || {}}>
            {num}
          </span>
        ))}
      </div>
      <button
        type='button'
        className='refresh-captcha-btn'
        onClick={fetchCaptcha}
      >
        🔄
      </button>
    </div>
  )
}

export default CapCha
