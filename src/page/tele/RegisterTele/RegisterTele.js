import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../LoginTele/LoginTele.css'
import { getApiUrl } from '../../../api'
import CapCha from '../../../components/CapCha/CapCha'

function RegisterTele () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [magioithieu, setMagioithieu] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const fetchCaptchaRef = useRef(null)
  const navigate = useNavigate()

  const validateUsername = name => /^[A-Za-z0-9]{6,18}$/.test(name)
  const validatePassword = pass =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(pass)

  const handleRegister = async () => {
    if (!validateUsername(username)) {
      alert(
        'Tên tài khoản phải từ 6-18 ký tự, không chứa dấu cách hoặc ký tự đặc biệt!'
      )
      return
    }
    if (!validatePassword(password)) {
      alert('Mật khẩu phải 6-18 ký tự, bao gồm cả chữ và số!')
      return
    }

    if (captchaInput !== captcha) {
      alert('Mã captcha không đúng!')
      if (fetchCaptchaRef.current) fetchCaptchaRef.current()
      return
    }

    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user
    if (!user) {
      alert('Không lấy được Telegram ID! Vui lòng mở từ Telegram.')
      return
    }

    try {
      const res = await fetch(`${getApiUrl('backend')}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          magioithieu,
          telegramId: user.id
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Đăng ký thành công!')
        navigate('/')
      } else {
        alert(data.message || 'Đăng ký thất bại!')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi kết nối server!')
    }
  }

  return (
    <div className='login-container'>
      <img src='/assets/logo.png' alt='Khu Vườn Trên Mây' className='logo' />

      <div className='form'>
        <div className='input-group'>
          <span className='icon'>👤</span>
          <input className='inputfont'
            type='text'
            placeholder='Tên đăng nhập'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <span className='icon'>🔒</span>
          <input className='inputfont'
            type='password'
            placeholder='Mật khẩu'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <span className='icon'>🎁</span>
          <input className='inputfont'
            type='text'
            placeholder='Mã giới thiệu (nếu có)'
            value={magioithieu}
            onChange={e => setMagioithieu(e.target.value)}
          />
        </div>

        <CapCha
          captcha={captcha}
          captchaInput={captchaInput}
          setCaptcha={setCaptcha}
          setCaptchaInput={setCaptchaInput}
          onFetch={fn => (fetchCaptchaRef.current = fn)}
        />

        <button className='btn-login' onClick={handleRegister}>
          ĐĂNG KÝ
        </button>
        <button className='btn-register' onClick={() => navigate('/')}>
          QUAY LẠI ĐĂNG NHẬP
        </button>
      </div>
    </div>
  )
}

export default RegisterTele
