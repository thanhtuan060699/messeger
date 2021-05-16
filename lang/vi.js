export const transValidation={
    email_incorrect:"Email phải có dạng example@tdev.com",
    gender_incorrect:"Giới tính sai",
    password_incorrect:"Mật khẩu chưa ít nhất 8 kí tự",
    password_confirmation_incorrect:"Nhập lại mật khẩu chưa chính xác"

};
export const transErrors={
    account_in_use:"Email này đã được sử dụng",
    account_removed:"Tài khoản đã bị gỡ khỏi hệ thống",
    account_not_active:"Tài khoản này chưa được active",
    login_failed:"Sai tài khoản hoặc mật khẩu ",
    avatar_type:"Kiểu file không hợp lệ ",
    avatar_size:"Size file vượt quá 1 MB",
    current_password_failed : "Mật khẩu hiện tại không đúng !!! Vui lòng nhập lại"
}
export const transSuccess={
    userCreated:(userEmail)=>{
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo,vui lòng kiểm tra email để active`
    },
    account_actived:"Kích hoạt tài khoản thành công,bạn có thể đăng nhập vào ứng dụng.",
    loginSuccess:(username) =>{
        return `Xin chào ${username}, chúc bạn ngày mới tốt lành`
    },
    logout_success : "Đăng xuất tài khoản thành công !!!",
    avatar_updated : "Cập nhật ảnh đại diện thành công ",
    userInfo_updated : "Cập nhật thông tin người dùng thành công",
    user_change_password : "Cập nhật mật khẩu thành công"
}

export const transMail={
    subject:"Awesome Chat : Xác nhận kích hoạt tài khoản",
    template:(linkVerify) =>{
        return `
            <h2>Bạn nhận được email này vì đã đăng ký tài khoản trên Awesome chat </h2>
            <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
            <h4>Thank you !!!</h4>
        `
    },
    send_failed:"Có lỗi trong quá trình xác nhận email"
}