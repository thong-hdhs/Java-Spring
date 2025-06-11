import React from 'react';

// Bảng màu đẹp để lựa chọn ngẫu nhiên
const PALETTE = [
  '#4285F4', '#EA4335', '#FBBC05', '#34A853'
];

const UserAvatar = ({ name, size = 40 }) => {
  // Hàm lấy ký tự đầu tiên của tên, viết hoa
  const getInitial = (name) => {
    if (!name) return '?';
    return name.trim().toUpperCase()[0];
  };

  // Hàm tạo màu nền nhất quán dựa trên tên người dùng
  const generateColor = (name) => {
    if (!name) return '#cccccc'; // Màu mặc định nếu không có tên
    // Tạo một giá trị hash đơn giản từ tên
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Dùng hash để chọn một màu từ bảng màu PALETTE
    const index = Math.abs(hash % PALETTE.length);
    return PALETTE[index];
  };

  const initial = getInitial(name);
  const backgroundColor = generateColor(name);

  // Style cho component, sử dụng inline style để áp dụng các giá trị động
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: `${size / 2.2}px`, // Kích thước chữ tỷ lệ với kích thước avatar
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div style={avatarStyle} title={name}>
      {initial}
    </div>
  );
};

export default UserAvatar;