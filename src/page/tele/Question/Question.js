import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../../components/UserContext";
import Fireworks from "../../../components/Fireworks";
import RewardTapModal from "../../../components/RewardQuestionModal/RewardQuestionModal";
import ErrorModal from "../../../components/ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../../api";

function QuestionList() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const hasFetched = useRef(false);
  const data_user = JSON.parse(localStorage.getItem("user"));
  const { user, fetchUser } = useUser();
  const [fireworksTrigger, setFireworksTrigger] = useState(false);
  const [rewardTap, setRewardTap] = useState(0);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // modal báo lỗi
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id);
      hasFetched.current = true;
    }
  }, [data_user]);

  const fetchQuestions = async () => {
    const res = await fetch(`${getApiUrl("backend")}/getcauhoi`);
    const data = await res.json();
    setQuestions(data);
  };

  const handleAnswer = async (questionId, answer) => {
    try {
      const res = await fetch(
        `${getApiUrl("backend")}/posttraloicauhoi/${questionId}/${user._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dapan: answer }),
        }
      );

      if (res.status === 400) {
        const errData = await res.json();
        setErrorMessage(errData?.message || "Đã xảy ra lỗi.");
        setShowErrorModal(true);
        return;
      }

      const data = await res.json();
      setAnswerResult({
        chosen: answer,
        correct: data.dapandung,
        status: data.lichsucauhoi.status,
      });

      if (data.lichsucauhoi.status) {
        setRewardTap(selectedQuestion.luottap);
        setShowRewardModal(true);
        setFireworksTrigger(true);
      }
    } catch (err) {
      setErrorMessage("Lỗi kết nối đến máy chủ.");
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="home-container">
      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "#fdf1d1",
          border: "2px solid #E5B25D",
          padding: "6px 12px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
      Trang chủ
      </button>

      <h2 style={{ textAlign: "center", marginTop: "60px", color: "#a16600ff" }}>
        Danh sách câu hỏi
      </h2>

      {questions.map((q) => (
        <div
          key={q._id}
          className="boxtele"
          onClick={() => {
            setSelectedQuestion(q);
            setAnswerResult(null);
          }}
        >
          {q.cauhoi}
        </div>
      ))}

      {selectedQuestion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQuestion(null)}
              style={{
                position: "absolute",
                top: "35px",
                right: "8px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h3>{selectedQuestion.cauhoi}</h3>
            {answerResult && !answerResult.status && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                Bạn đã trả lời sai
              </p>
            )}

            {selectedQuestion.dapan.map((ans, idx) => {
              let bgColor = "#fdf1d1";
              if (answerResult) {
                if (ans === answerResult.correct) {
                  bgColor = "lightgreen";
                }
                if (
                  !answerResult.status &&
                  ans === answerResult.chosen &&
                  ans !== answerResult.correct
                ) {
                  bgColor = "lightcoral";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(selectedQuestion._id, ans)}
                  disabled={!!answerResult}
                  style={{
                    display: "block",
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    backgroundColor: bgColor,
                    cursor: answerResult ? "default" : "pointer",
                  }}
                >
                  {String.fromCharCode(65 + idx)}. {ans}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <RewardTapModal
        show={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          setFireworksTrigger(false);
          setSelectedQuestion(null);
        }}
        rewardTap={rewardTap}
      />

      <ErrorModal
        show={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setSelectedQuestion(null);
        }}
        message={errorMessage}
      />
      <Fireworks trigger={fireworksTrigger} />
    </div>
  );
}

export default QuestionList;
