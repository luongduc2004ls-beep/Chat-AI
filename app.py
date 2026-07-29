import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from google import genai

# Đọc biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)

# Lấy Gemini API Key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "Không tìm thấy GEMINI_API_KEY. "
        "Hãy tạo file .env và thêm GEMINI_API_KEY."
    )

# Tạo Gemini client
client = genai.Client(api_key=api_key)


@app.route("/")
def home():
    """Hiển thị giao diện chatbot."""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    """Nhận câu hỏi từ website và gửi tới Gemini."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Dữ liệu gửi lên không hợp lệ."
            }), 400

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "error": "Bạn chưa nhập câu hỏi."
            }), 400

        response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=message
)

        answer = response.text

        if not answer:
            answer = "AI không trả về nội dung."

        return jsonify({
            "answer": answer
        })

    except Exception as error:
        print(f"Lỗi: {error}")

        return jsonify({
            "error": "Không thể kết nối với AI. Hãy kiểm tra API Key và thử lại."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)