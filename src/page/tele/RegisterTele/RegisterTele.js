import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../LoginTele/LoginTele.css'
import { getApiUrl } from '../../../api'
import CapCha from '../../../components/CapCha/CapCha'
import Loading from '../../../components/Loading/Loading'
import Notify from '../../../components/Notify/Notify'

function RegisterTele () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [magioithieu, setMagioithieu] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [loading, setLoading] = useState(false);
  const fetchCaptchaRef = useRef(null)
  const navigate = useNavigate()
const [notify, setNotify] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showNotify = (message, type = "success") => {
    setNotify({ show: true, message, type });
  };
  const validateUsername = name => /^[A-Za-z0-9]{6,18}$/.test(name)
  const validatePassword = pass =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(pass)

  const handleRegister = async () => {
    if (!validateUsername(username)) {

      showNotify("Tên tài khoản phải từ 6-18 ký tự, không chứa dấu cách hoặc ký tự đặc biệt!", "error");

      return
    }
    if (!validatePassword(password)) {
      showNotify("Mật khẩu phải 6-18 ký tự, bao gồm cả chữ và số!", "error");
      return
    }

    if (captchaInput !== captcha) {
      showNotify("Mã captcha không đúng!", "error");
      if (fetchCaptchaRef.current) fetchCaptchaRef.current()
      return
    }

    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe?.user
    if (!user) {
      showNotify("Không lấy được Telegram ID! Vui lòng mở từ Telegram.", "error");

      return
    }
    setLoading(true)
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
      showNotify("Đăng ký thành công!", "success");

        navigate('/')
      } else {
        showNotify(data.message || 'Đăng ký thất bại!', "success");
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi kết nối server!')
    }finally{
      setLoading(false)
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

export default RegisterTele
