import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import axios from "axios";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    
    // State cho modal edit user
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        phoneNumber: '',
        age: '',
        gender: ''
    });
    
    const { userAuth: { accessToken } } = useContext(UserContext);

    // Lấy danh sách user từ API
    const fetchUsers = async (page = 1, pageSize = 5) => {
        setLoading(true);
        
        // Debug: Kiểm tra token
        console.log("Access Token:", accessToken);
        console.log("Token length:", accessToken?.length);
        
        // Kiểm tra token có tồn tại không
        if (!accessToken) {
            toast.error("Không có token xác thực");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/users?page=${page}&size=${pageSize}`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            const listUser = response.data.data.result || [];
            const meta = response.data.data.meta || {};
            
            setUsers(listUser);
            setPagination({
                ...pagination,
                current: page,
                total: meta.total || 0
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.status === 401) {
                toast.error("Token hết hạn hoặc không hợp lệ");
            } else if (error.response?.status === 403) {
                toast.error("Không có quyền truy cập");
            } else {
                toast.error("Không thể tải danh sách người dùng");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        fetchUsers(page, pagination.pageSize);
    };

    // Xử lý thay đổi input tìm kiếm
    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };

    // Xử lý submit form tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            performSearch(1, pagination.pageSize);
        } else {
            // Nếu search text rỗng thì load lại danh sách ban đầu
            fetchUsers(1, pagination.pageSize);
        }
    };

    // Hàm thực hiện tìm kiếm
    const performSearch = async (page = 1, pageSize = 5) => {
        setLoading(true);
        
        // Kiểm tra token có tồn tại không
        if (!accessToken) {
            toast.error("Không có token xác thực");
            setLoading(false);
            return;
        }

        try {
            // Tạo filter kết hợp search text và role filter
            let filterQuery = `fullName~'${searchText}' or email~'${searchText}'`;
            
            // Nếu có role filter, kết hợp với search
            if (roleFilter !== "all") {
                let roleFilterQuery = '';
                switch (roleFilter) {
                    case 'admin':
                        roleFilterQuery = "role~'ADMIN'";
                        break;
                    case 'user':
                        roleFilterQuery = "role~'MEMBER'";
                        break;
                }
                if (roleFilterQuery) {
                    filterQuery = `(${filterQuery}) and ${roleFilterQuery}`;
                }
            }

            const response = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/users?page=${page}&size=${pageSize}&filter=${filterQuery}`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            const listUser = response.data.data.result || [];
            const meta = response.data.data.meta || {};
            
            setUsers(listUser);
            setPagination({
                ...pagination,
                current: page,
                total: meta.total || 0
            });
        } catch (error) {
            console.error("Error searching users:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.status === 401) {
                toast.error("Token hết hạn hoặc không hợp lệ");
            } else if (error.response?.status === 403) {
                toast.error("Không có quyền truy cập");
            } else {
                toast.error("Không thể tìm kiếm người dùng");
            }
        } finally {
            setLoading(false);
        }
    };

    // Xử lý lọc theo role
    const handleRoleFilter = async (e) => {
        const selectedRole = e.target.value;
        setRoleFilter(selectedRole);
        
        // Nếu chọn "all" thì load lại danh sách ban đầu
        if (selectedRole === "all") {
            fetchUsers(1, pagination.pageSize);
            return;
        }
        
        setLoading(true);
        
        // Kiểm tra token có tồn tại không
        if (!accessToken) {
            toast.error("Không có token xác thực");
            setLoading(false);
            return;
        }

        try {
            // Map role từ UI sang API format
            let roleFilter = '';
            switch (selectedRole) {
                case 'admin':
                    roleFilter = "role~'ADMIN'";
                    break;
                case 'user':
                    roleFilter = "role~'MEMBER'";
                    break;
                default:
                    roleFilter = "role~'MEMBER'";
            }

            const response = await axios.get(
                import.meta.env.VITE_SERVER_DOMAIN + `/api/users?page=1&size=${pagination.pageSize}&filter=${roleFilter}`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            const listUser = response.data.data.result || [];
            const meta = response.data.data.meta || {};
            
            setUsers(listUser);
            setPagination({
                ...pagination,
                current: 1, // Reset về trang 1 khi filter
                total: meta.total || 0
            });
        } catch (error) {
            console.error("Error filtering users by role:", error);
            console.error("Error response:", error.response?.data);
            
            if (error.response?.status === 401) {
                toast.error("Token hết hạn hoặc không hợp lệ");
            } else if (error.response?.status === 403) {
                toast.error("Không có quyền truy cập");
            } else {
                toast.error("Không thể lọc người dùng theo vai trò");
            }
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị modal xác nhận xóa user
    const showDeleteConfirm = (userId, userName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}" không? Hành động này sẽ không thể hoàn tác.`)) {
            handleDeleteUser(userId);
        }
    };

    // Xử lý xóa user
    const handleDeleteUser = async (userId) => {
        const loadingToast = toast.loading("Đang xóa người dùng...");
        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/users/${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            );
            toast.dismiss(loadingToast);
            toast.success("Xóa người dùng thành công");
            fetchUsers(pagination.current, pagination.pageSize); // Refresh danh sách
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Không thể xóa người dùng");
        }
    };

    // Xử lý chỉnh sửa user
    const handleEditUser = (userId) => {
        // Tìm user cần edit
        const user = users.find(u => u.id === userId);
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                address: user.address || '',
                phoneNumber: user.phoneNumber || '',
                age: user.age || '',
                gender: user.gender || ''
            });
            setEditModalVisible(true);
        }
    };

    // Đóng modal edit
    const handleCloseEditModal = () => {
        setEditModalVisible(false);
        setEditingUser(null);
        setFormData({
            fullName: '',
            email: '',
            address: '',
            phoneNumber: '',
            age: '',
            gender: ''
        });
    };

    // Xử lý thay đổi form
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit form edit user
    const handleSubmitEditUser = async (e) => {
        e.preventDefault();
        console.log("handleSubmitEditUser called.");
        if (!editingUser) {
            console.log("No editingUser, returning.");
            return;
        }

        // Validate các trường bắt buộc
        if (!formData.fullName.trim()) {
            toast.error("Họ và tên không được để trống!");
            console.log("Full name validation failed.");
            return;
        }
        if (!formData.address.trim()) {
            toast.error("Địa chỉ không được để trống!");
            console.log("Address validation failed.");
            return;
        }
        if (!formData.phoneNumber.trim()) {
            toast.error("Số điện thoại không được để trống!");
            console.log("Phone number validation failed.");
            return;
        }
        if (!formData.age) {
            toast.error("Năm sinh không được để trống!");
            console.log("Age validation failed (empty).");
            return;
        }
        if (!formData.gender) {
            toast.error("Giới tính không được để trống!");
            console.log("Gender validation failed.");
            return;
        }
        
        // Validate tuổi trước khi submit
        if (formData.age && (formData.age < 1905 || formData.age > 2007)) {
            toast.error("Năm sinh phải từ 1905 đến 2007!");
            console.log("Age validation failed (range).");
            return;
        }
        
        setEditLoading(true);
        console.log("Attempting to update user with data:", formData);
        console.log("Using accessToken:", accessToken);
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/users/${editingUser.id}`,
                {
                    fullName: formData.fullName,
                    address: formData.address,
                    phoneNumber: formData.phoneNumber,
                    age: formData.age || null,
                    gender: formData.gender
                },
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            );
            
            toast.success("Cập nhật thông tin user thành công!");
            handleCloseEditModal();
            // Refresh danh sách user
            fetchUsers(pagination.current, pagination.pageSize);
            console.log("User update successful.");
        } catch (error) {
            console.error("Error updating user:", error);
            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                // Có thể thêm logic để chuyển hướng người dùng đến trang đăng nhập
            } else {
                toast.error(error.response?.data?.message || "Không thể cập nhật thông tin user");
            }
        } finally {
            setEditLoading(false);
            console.log("Edit loading set to false.");
        }
    };

    // Helper function để hiển thị role
    const getRoleDisplay = (role) => {
        switch (role) {
            case 'ADMIN': return { text: 'Quản trị viên', color: 'bg-red-100 text-red-800' };
            case 'MEMBER': return { text: 'Thành viên', color: 'bg-blue-100 text-blue-800' };
            default: return { text: 'Khách', color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Helper function để hiển thị gender
    const getGenderDisplay = (gender) => {
        switch (gender) {
            case 'MALE': return { text: 'Nam', color: 'bg-blue-100 text-blue-800' };
            case 'FEMALE': return { text: 'Nữ', color: 'bg-pink-100 text-pink-800' };
            default: return { text: 'N/A', color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Hàm reset về trạng thái ban đầu
    const handleReset = () => {
        setSearchText("");
        setRoleFilter("all");
        fetchUsers(1, pagination.pageSize);
    };

    // Xử lý thay đổi vai trò người dùng
    const handleChangeRole = async (userId, newRole) => {
        const loadingToast = toast.loading("Đang cập nhật vai trò...");
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_SERVER_DOMAIN}/api/users/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            toast.dismiss(loadingToast);
            toast.success("Cập nhật vai trò thành công!");
            // Cập nhật lại danh sách người dùng để hiển thị vai trò mới
            fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Error updating user role:", error);
            toast.error(error.response?.data?.message || "Không thể cập nhật vai trò người dùng");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-1">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
                <p className="text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px]">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                value={searchText}
                                onChange={handleSearchInputChange}
                                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>
                    </div>
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilter}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="user">Người dùng</option>
                    </select>
                    <button 
                        onClick={handleReset}
                        className="px-6 py-3 btn-dark"
                    >
                        Làm mới
                    </button>
                    {searchText && (
                        <button 
                            onClick={() => {
                                setSearchText("");
                                setRoleFilter("all");
                                fetchUsers(1, pagination.pageSize);
                            }}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Xóa tìm kiếm
                        </button>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Người dùng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số điện thoại
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tuổi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giới tính
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Địa chỉ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày tạo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => {
                                        const roleDisplay = getRoleDisplay(user.role);
                                        const genderDisplay = getGenderDisplay(user.gender);
                                        
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.fullName || 'Chưa có tên'}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.phoneNumber || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.age || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${genderDisplay.color}`}>
                                                        {genderDisplay.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="max-w-[200px] truncate" title={user.address || 'N/A'}>
                                                        {user.address || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleDisplay.color}`}>
                                                        {roleDisplay.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.createAt ? new Date(user.createAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2 items-center">
                                                        <button
                                                            onClick={() => handleEditUser(user.id)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => showDeleteConfirm(user.id, user.fullName)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                                            className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="GUEST">Khách</option>
                                                            <option value="MEMBER">Thành viên</option>
                                                            <option value="ADMIN">Quản trị viên</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.total > 0 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(pagination.current - 1)}
                                        disabled={pagination.current === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.current + 1)}
                                        disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Hiển thị <span className="font-medium">{((pagination.current - 1) * pagination.pageSize) + 1}</span> đến{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                                            </span>{' '}
                                            của <span className="font-medium">{pagination.total}</span> kết quả
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => handlePageChange(pagination.current - 1)}
                                                disabled={pagination.current === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(pagination.current + 1)}
                                                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal Edit User */}
            {editModalVisible && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin người dùng</h3>
                                <button
                                    onClick={handleCloseEditModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmitEditUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                                            placeholder="Email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Năm sinh
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleFormChange}
                                            min="1905"
                                            max="2007"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập năm sinh (1905-2007)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giới tính
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseEditModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="px-4 py-2 btn-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang cập nhật...
                                            </div>
                                        ) : (
                                            'Cập nhật'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUser;