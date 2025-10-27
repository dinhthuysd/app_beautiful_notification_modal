# 🔐 HƯỚNG DẪN ĐĂNG NHẬP TEST

## ✅ Server Status
- ✅ Backend: RUNNING (Port 8001)
- ✅ Frontend: RUNNING (Port 3000)
- ✅ MongoDB: RUNNING (Port 27017)

## 🌐 URL Truy Cập

**Frontend:** http://localhost:3000
**Login Page:** http://localhost:3000/admin/login

## 🔑 Thông Tin Đăng Nhập Admin

```
📧 Email: admin@trading.com
🔑 Password: Admin@123456
```

## 📱 Test Responsive

### Desktop:
- Truy cập: http://localhost:3000/admin/login
- Đăng nhập với thông tin trên
- Sidebar cố định, có thể toggle

### Mobile (Test trên Chrome DevTools):
1. Bấm F12 để mở DevTools
2. Bấm Ctrl+Shift+M để toggle device toolbar
3. Chọn iPhone SE hoặc thiết bị mobile khác
4. Test menu drawer trượt ra

### Tablet:
- Chọn iPad trong DevTools
- Test layout 2 cột

## 🎯 Chức Năng Đã Test

✅ Login page responsive
✅ Admin layout với sidebar/drawer
✅ Dashboard với stats cards
✅ Touch-friendly buttons
✅ Safe area padding
✅ PWA manifest

## 🚀 Test PWA (Trên Mobile Thật)

### iOS (iPhone):
1. Mở Safari
2. Vào: http://localhost:3000 (hoặc IP của máy)
3. Tap Share > Add to Home Screen

### Android:
1. Mở Chrome
2. Vào: http://localhost:3000 (hoặc IP của máy)
3. Tap menu > Install app

## 📊 Backend API

Backend đang chạy tại: http://localhost:8001/api/

Test endpoints:
- GET http://localhost:8001/api/ - Hello World
- POST http://localhost:8001/api/admin/login - Admin login

## 🔄 Restart Server (Nếu Cần)

```bash
sudo supervisorctl restart all
```

## 📝 Notes

- Admin account đã được tạo sẵn
- Role: super_admin (full permissions)
- 2FA: Disabled (để dễ test)
- Password đã được hash với bcrypt

---

**Ready to test! Hãy truy cập http://localhost:3000/admin/login và đăng nhập! 🎉**
