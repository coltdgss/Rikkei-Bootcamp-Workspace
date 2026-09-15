// 1. Lấy dữ liệu từ LocalStorage. 
// Chú ý: LocalStorage chỉ lưu được chuỗi (String). Nếu chưa có dữ liệu, trả về mảng rỗng [].
// Dùng JSON.parse để chuyển chuỗi thành Mảng Javascript.
let students = JSON.parse(localStorage.getItem('students')) || []; // Nếu LocalStorage chưa có key 'students' thì trả về null, lúc đó sẽ dùng mảng rỗng [] thay thế

// Biến này để theo dõi xem ta đang THÊM MỚI (giá trị -1) hay ĐANG SỬA  có giá trị >= 0(chứa index của học viên)
let editIndex = -1; 

// Ngay khi load trang, phải vẽ bảng luôn
renderTable(students);


function validateData(fullName, email, phone, address) {
    if (!fullName) {
        alert("Họ và tên không được để trống!");
        return false;
    }
    if (!address) {
        alert("Quê quán không được để trống!");
        return false;
    }
    
    // Regex kiểm tra định dạng email chuẩn
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;// Đây là regex đơn giản để kiểm tra email có dạng: "chuỗi không chứa khoảng trắng" + "@" + "chuỗi không chứa khoảng trắng" + "." + "chuỗi không chứa khoảng trắng"
    if (!emailRegex.test(email)) {
        alert("Email không đúng định dạng!");
        return false;
    }

    // Regex kiểm tra số điện thoại Việt Nam (Bắt đầu bằng 0, độ dài 10 số)
    let phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không đúng định dạng VN!");
        return false;
    }

    return true; // Nếu vượt qua mọi cửa ải trên thì dữ liệu hợp lệ
}


function saveStudent() {
    // Lấy dữ liệu người dùng nhập từ các ô Input thông qua ID
    let fullName = document.getElementById('fullName').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let address = document.getElementById('address').value.trim();
    
    // Kiểm tra xem nút radio Nam hay Nữ đang được check
    let gender = document.getElementById('genderMale').checked ? "Nam" : "Nữ";

    // Gọi hàm kiểm tra dữ liệu
    if (!validateData(fullName, email, phone, address)) {
        return; // Nếu sai định dạng, dừng hàm luôn, không chạy code bên dưới nữa
    }

    // Gói dữ liệu vào 1 object
    let studentObj = {
        name: fullName,
        email: email,
        phone: phone,
        address: address,
        gender: gender
    };

    if (editIndex === -1) {
        // TRƯỜNG HỢP 1: THÊM MỚI (editIndex đang là -1)
        students.push(studentObj);
    } else {
        // TRƯỜNG HỢP 2: CẬP NHẬT (editIndex đang lưu vị trí cần sửa)
        students[editIndex] = studentObj;
        editIndex = -1; // Sửa xong thì reset lại trạng thái thành Thêm mới
    }

    // Cập nhật lại LocalStorage. Nhớ dùng JSON.stringify để biến Mảng thành Chuỗi
    localStorage.setItem('students', JSON.stringify(students));
    
    // Vẽ lại bảng và xóa trắng form
    renderTable(students);
    document.getElementById('studentForm').reset();
}


function renderTable(dataArray) {
    let tbody = document.getElementById('tableBody');
    let htmlContent = ""; // Chuỗi HTML ban đầu là rỗng

    // Duyệt qua mảng truyền vào, dùng biến index làm STT
    dataArray.forEach((student, index) => {
        htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td>${student.gender}</td>
                <td>
                    <a href="#" onclick="editStudent(${index})">edit</a> | 
                    <a href="#" onclick="deleteStudent(${index})">delete</a>
                </td>
                <td></td>
            </tr>
        `;
    });

    // Ép toàn bộ chuỗi HTML vừa tạo vào thẻ tbody trên giao diện
    tbody.innerHTML = htmlContent;
}



function editStudent(index) {
    // 1. Đưa trạng thái về "Đang sửa" và lưu lại cái index
    editIndex = index;
    
    // 2. Lấy object học viên tại vị trí index đó ra
    let student = students[index];

    // 3. Đẩy ngược dữ liệu của học viên đó lên form
    document.getElementById('fullName').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('address').value = student.address;
    
    if (student.gender === "Nam") {
        document.getElementById('genderMale').checked = true;
    } else {
        document.getElementById('genderFemale').checked = true;
    }
}


function deleteStudent(index) {
    if (confirm("Em có chắc chắn muốn xóa học viên này?")) {
        // Dùng hàm splice để xóa 1 phần tử tại vị trí index trong mảng
        students.splice(index, 1);
        
        // Cập nhật lại LocalStorage và vẽ lại bảng
        localStorage.setItem('students', JSON.stringify(students));
        renderTable(students);
    }
}



function searchStudent() {
    // Lấy từ khóa, chuyển hết về chữ thường để tìm kiếm không phân biệt hoa/thường
    let keyword = document.getElementById('searchInput').value.toLowerCase();
    
    // Dùng hàm filter: Giữ lại những học viên mà tên có chứa từ khóa
    let filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(keyword)
    );

    // Bắt bảng vẽ lại bằng danh sách đã lọc, KHÔNG làm thay đổi mảng mảng gốc 'students'
    renderTable(filteredStudents);
}


function sortAlphabet() {
    // Clone (nhân bản) mảng gốc ra để tránh làm thay đổi trật tự mảng gốc lưu trong LocalStorage nếu em không muốn
    // Dùng hàm sort() kết hợp localeCompare() để so sánh chuỗi theo đúng bảng chữ cái
    let sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    
    renderTable(sortedStudents);
}