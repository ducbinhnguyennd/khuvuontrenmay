import React, { useEffect, useState } from 'react'

function QuestionList () {
  const [questions, setQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const idUser = localStorage.getItem('iduser')

  const fetchQuestions = async () => {
    const res = await fetch('https://demoaeviet.shop/getcauhoi')
    const data = await res.json()
    setQuestions(data)
  }

  const handleAnswer = async (questionId, answer) => {
    try {
      await fetch(
        `https://demoaeviet.shop/posttraloicauhoi/${questionId}/${idUser}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dapan: answer })
        }
      )
      setSelectedQuestion(null)
      fetchQuestions() // Refresh danh sách câu hỏi
    } catch (err) {
      console.error('Lỗi trả lời:', err)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Danh sách câu hỏi</h2>
      {questions.map(q => (
        <div
          key={q._id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedQuestion(q)}
        >
          {q.cauhoi}
        </div>
      ))}

      {/* Modal câu hỏi */}
      {selectedQuestion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>{selectedQuestion.cauhoi}</h3>
            {selectedQuestion.dapan.map((ans, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(selectedQuestion._id, ans)}
                style={{
                  display: 'block',
                  marginTop: '10px',
                  width: '100%',
                  padding: '8px'
                }}
              >
                {String.fromCharCode(65 + idx)}. {ans}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionList
