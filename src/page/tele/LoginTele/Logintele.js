import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginTele.css'
import { getApiUrl } from '../../../api'
import CapCha from '../../../components/CapCha/CapCha'
import Loading from '../../../components/Loading/Loading'

function LoginTele () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const fetchCaptchaRef = useRef(null)
const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ thông tin!')
      return
    }
    if (captchaInput !== captcha) {
      alert('Mã captcha không đúng!')
      if (fetchCaptchaRef.current) fetchCaptchaRef.current()
      return
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl('backend')}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            navigate('/')
          } else {
            alert('Sai tài khoản hoặc mật khẩu')
          }
        })
    } catch (err) {
      console.error(err)
      alert('Lỗi kết nối server!')
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='login-container'>
      {loading && <Loading />}
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
        <CapCha
          captcha={captcha}
          captchaInput={captchaInput}
          setCaptcha={setCaptcha}
          setCaptchaInput={setCaptchaInput}
          onFetch={fn => (fetchCaptchaRef.current = fn)}
        />
        <button className='btn-login' onClick={handleLogin}>
          ĐĂNG NHẬP
        </button>
        <button className='btn-register' onClick={() => navigate('/register')}>
          ĐĂNG KÝ
        </button>
      </div>
    </div>
  )
}

export default LoginTele
