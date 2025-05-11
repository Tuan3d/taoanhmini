document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const fixButton = document.getElementById('fixButton');
    const resultSection = document.getElementById('resultSection');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');

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
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewSection.style.display = 'block';
                    fixButton.disabled = false;
                    resultSection.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                alert('Vui lòng chọn file ảnh!');
            }
        }
    }

    // Xử lý nút "Khắc phục ngay"
    fixButton.addEventListener('click', async () => {
        const img = new Image();
        img.src = previewImage.src;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Tính toán kích thước mới để đảm bảo không vượt quá 800px
            if (width > 800 || height > 800) {
                if (width > height) {
                    height = Math.round((height * 800) / width);
                    width = 800;
                } else {
                    width = Math.round((width * 800) / height);
                    height = 800;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Chuyển đổi sang PNG và kiểm tra kích thước
            canvas.toBlob((blob) => {
                if (blob.size > 2 * 1024 * 1024) { // Nếu lớn hơn 2MB
                    alert('Ảnh sau khi xử lý vẫn lớn hơn 2MB. Vui lòng chọn ảnh khác.');
                    return;
                }

                const resultUrl = canvas.toDataURL('image/png');
                resultImage.src = resultUrl;
                resultSection.style.display = 'block';
                downloadBtn.href = resultUrl;
                downloadBtn.download = 'fixed_image.png';
            }, 'image/png');
        };
    });
}); 