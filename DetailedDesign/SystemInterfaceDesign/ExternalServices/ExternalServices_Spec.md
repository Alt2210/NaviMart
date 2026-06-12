# External Services Interface Specification

Đặc tả giao thức kết nối với các dịch vụ hệ thống bên ngoài (Third-party APIs).

## 1. Dịch vụ Gửi Email (Email SMTP Service)
- **Provider:** AWS SES hoặc SendGrid.
- **Protocol:** SMTP / HTTPS (REST API).
- **Use Case:** Gửi mã OTP xác thực, gửi thông báo cảnh báo thực phẩm hết hạn.
- **Authentication:** API Key (lưu trong `.env`).
- **Data Payload:**
  ```json
  {
    "to": "user@email.com",
    "subject": "NaviMart OTP",
    "htmlBody": "<b>Your code is: 123456</b>"
  }
  ```

## 2. Dịch vụ Xác thực Mạng xã hội (OAuth 2.0)
- **Providers:** Google, Facebook.
- **Protocol:** OAuth 2.0 Authorization Code Flow.
- **Use Case:** Đăng nhập/Đăng ký nhanh không cần mật khẩu.
- **Interface Data:**
  - Input: `authorization_code` từ Client.
  - Output: `User Profile` (Email, Full Name, Avatar URL) từ Google/Facebook APIs.

## 3. Dịch vụ AI (AI Recipe Engine)
- **Provider:** OpenAI API (ChatGPT) hoặc Google Gemini.
- **Protocol:** RESTful HTTPS.
- **Use Case:** Gợi ý thực đơn, sinh công thức món ăn tự động dựa trên nguyên liệu tủ lạnh.
- **Data Payload (Prompt):**
  ```json
  {
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Tôi có Thịt lợn, Cà chua. Gợi ý 1 món ăn Việt Nam."}
    ]
  }
  ```
