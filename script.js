document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const fixButton = document.getElementById('fixButton');
    const resultSection = document.getElementById('resultSection');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;

    // Xử lý kéo thả
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2980b9';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Xử lý click để chọn file
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Xử lý file ảnh
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                originalFile = file;
                const objectUrl = URL.createObjectURL(file);
                previewImage.src = objectUrl;
                previewSection.style.display = 'block';
                fixButton.disabled = false;
                resultSection.style.display = 'none';

                // Dọn dẹp URL khi không cần thiết
                previewImage.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                };
            } else {
                alert('Vui lòng chọn file ảnh!');
            }
        }
    }

    // Hàm tạo MD5 hash
    async function generateMD5(file) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Xử lý nút "Khắc phục ngay"
    fixButton.addEventListener('click', async () => {
        if (!originalFile) return;

        try {
            const img = new Image();
            const objectUrl = URL.createObjectURL(originalFile);
            
            img.onload = async () => {
                // Tạo canvas với kích thước gốc
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Giữ nguyên kích thước gốc
                canvas.width = img.width;
                canvas.height = img.height;

                // Vẽ ảnh với chất lượng cao
                ctx.drawImage(img, 0, 0);

                // Chuyển đổi sang PNG
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
                
                // Tạo file mới với tên gốc
                const newFile = new File([blob], originalFile.name.replace(/\.[^/.]+$/, '.png'), {
                    type: 'image/png'
                });

                // Tạo URL cho file mới
                const resultUrl = URL.createObjectURL(newFile);
                resultImage.src = resultUrl;
                resultSection.style.display = 'block';

                // Cập nhật nút tải xuống
                downloadBtn.href = resultUrl;
                downloadBtn.download = newFile.name;

                // Thêm thuộc tính để lưu vào thư viện điện thoại
                downloadBtn.setAttribute('download', '');
                downloadBtn.setAttribute('target', '_blank');
                
                // Thêm sự kiện click để xử lý tải xuống trên điện thoại
                downloadBtn.onclick = async (e) => {
                    e.preventDefault();
                    
                    // Kiểm tra nếu là thiết bị di động
                    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                        try {
                            // Tạo blob URL
                            const blobUrl = URL.createObjectURL(blob);
                            
                            // Tạo thẻ a ẩn
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = blobUrl;
                            a.download = newFile.name;
                            
                            // Thêm vào DOM và click
                            document.body.appendChild(a);
                            a.click();
                            
                            // Dọn dẹp
                            setTimeout(() => {
                                document.body.removeChild(a);
                                URL.revokeObjectURL(blobUrl);
                            }, 100);
                        } catch (error) {
                            console.error('Lỗi khi tải xuống:', error);
                            alert('Không thể tải xuống ảnh. Vui lòng thử lại.');
                        }
                    }
                };

                // Dọn dẹp URL
                URL.revokeObjectURL(objectUrl);
            };

            img.src = objectUrl;
        } catch (error) {
            console.error('Lỗi khi xử lý ảnh:', error);
            alert('Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.');
        }
    });
}); 