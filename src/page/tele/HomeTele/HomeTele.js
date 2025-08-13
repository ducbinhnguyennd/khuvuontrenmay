import React, { useContext, useEffect, useRef, useState } from 'react'
import './HomeTele.css'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../components/UserContext'

function Hometele () {
  const [tasks, setTasks] = useState([])
  const navigate = useNavigate()
  const hasFetched = useRef(false)
  const data_user = JSON.parse(localStorage.getItem('user'))
  console.log(data_user._id)

  const { user, fetchUser } = useUser()
  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id)
      hasFetched.current = true
    }
  }, [data_user])
  console.log(user)

  const loadNhiemvu = async () => {
    try {
      const res = await fetch(`https://demoaeviet.shop/getnhiemvu/${user._id}`)
      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`)
      }
      const data = await res.json()
      console.log('Dữ liệu nhiệm vụ:', data)
      setTasks(data)
    } catch (err) {
      console.error('Lỗi khi lấy nhiệm vụ:', err)
    }
  }

  const handleLamNhiemVu = async idNhiemVu => {
    if (!user?._id) {
      console.error('Người dùng chưa đăng nhập')
      return
    }
    try {
      await fetch(
        `https://demoaeviet.shop/postlamnhiemvu/${idNhiemVu}/${user._id}`,
        {
          method: 'POST'
        }
      )
      loadNhiemvu(user._id)
    } catch (err) {
      console.error('Lỗi làm nhiệm vụ:', err)
    }
  }
  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }
  const tap = async () => {
    if (!user?._id) {
      console.error('Người dùng chưa đăng nhập')
      return
    }
    try {
      await fetch(`https://demoaeviet.shop/tapcay/${user._id}`, {
        method: 'POST'
      })
      fetchUser(user._id)
    } catch (err) {
      console.error('Lỗi tap cây:', err)
    }
  }

  const getIconByType = type => {
    switch (type) {
      case 'youtube':
        return '/assets/tele/youtube.png'
      case 'telegram':
        return '/assets/tele/telegram.png'
      case 'tiktok':
        return '/assets/tele/tiktok.png'
      case 'facebook':
        return '/assets/tele/fb.png'
      case 'instagram':
        return '/assets/tele/instagram.png'
      case 'threads':
        return '/assets/tele/threads.png'
      case 'twitter':
        return '/assets/tele/twitter.png'
      default:
        return '/assets/coinm.png'
    }
  }

  useEffect(() => {
    if (user?._id) {
      loadNhiemvu(user._id)
    }
  }, [user])

  return (
    <div className='home-container'>
      <div className='coin-display'>
        <img src='/assets/coinm.png' alt='coin' className='coin-icon' />
        <span className='coin-amount'>{user?.mskc?.toLocaleString() || 0}</span>
        <span className='coin-amount'>{user?.username}</span>
      </div>
      <div className='logout' onClick={logout}>
        <img src='/assets/coinm.png' alt='coin' className='coin-icon' />
        <span className='coin-amount'>Đăng xuất</span>
      </div>

      <img
        src='/assets/logo.png'
        alt='Khu Vườn Trên Mây'
        className='logo-hometl'
      />
      <img src='/assets/cay2.png' alt='tree' className='tree' />

      <button className='btn-tap' onClick={tap}>
        TAP TO EARN
      </button>
      <div className='tap-count'>
        Bạn còn <span className='highlight'>{user?.luottap || 0}</span> lượt tap
      </div>

      {tasks.length > 0 ? (
        tasks.map(task => (
          <div
            key={task._id}
            className='task'
            onClick={() => {
              handleLamNhiemVu(task._id)
              if (task.link) {
                window.open(task.link, '_blank')
              }
            }}
          >
            <img
              src={getIconByType(task.type)}
              alt={task.type}
              className='task-icon'
            />
            <span className='task-title'>{task.diengiai}</span>
            <span className='reward'>+{task.luottap}</span>
          </div>
        ))
      ) : (
        <p>Không có nhiệm vụ nào</p>
      )}

      <div
        onClick={() => navigate('/questions')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FDF1D1',
          borderRadius: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          width: 'fit-content',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          border: '2px solid #E5B25D',
          marginTop: '30px'
        }}
      >
        <span className='task-title'>
          Trả lời câu hỏi để nhận thêm lượt tap
        </span>
        <span
          style={{
            marginLeft: '10px',
            backgroundColor: '#E5B25D',
            borderRadius: '8px',
            padding: '10px 12px',
            fontWeight: 'bold',
            color: '#5B3B0A',
            fontSize: '14px'
          }}
        >
          Đi vào
        </span>
      </div>
    </div>
  )
}

export default Hometele
