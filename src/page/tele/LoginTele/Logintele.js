import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginTele.css'
import { getApiUrl } from '../../../api'
import CapCha from '../../../components/CapCha/CapCha'
import Loading from '../../../components/Loading/Loading'
import Notify from "../../../components/Notify/Notify";
function LoginTele () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const fetchCaptchaRef = useRef(null)
const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
const [notify, setNotify] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showNotify = (message, type = "success") => {
    setNotify({ show: true, message, type });
  };
  const handleLogin = async () => {
    if (!username || !password) {
      showNotify("Vui lòng nhập đầy đủ thông tin!", "error");
      return
    }
    if (captchaInput !== captcha) {
      showNotify("Capcha không đúng", "error");
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
             showNotify("Đăng nhập thành công", "success");
            navigate('/')
          } else {
            showNotify("Sai tài khoản hoặc mật khẩu", "error");
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
      {notify.show && (
        <Notify
          message={notify.message}
          type={notify.type}
          onClose={() => setNotify({ ...notify, show: false })}
        />
      )}
    </div>
  )
}

export default LoginTele
