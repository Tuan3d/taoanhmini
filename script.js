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
            const ctx = canvas.getContext('2d');

            // Giữ nguyên kích thước gốc của ảnh
            canvas.width = img.width;
            canvas.height = img.height;

            // Vẽ ảnh gốc lên canvas với chất lượng cao nhất
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);

            // Chuyển đổi sang PNG với chất lượng cao nhất
            canvas.toBlob((blob) => {
                if (blob.size > 2 * 1024 * 1024) { // Nếu lớn hơn 2MB
                    // Thử nén ảnh với chất lượng thấp hơn
                    canvas.toBlob((compressedBlob) => {
                        if (compressedBlob.size > 2 * 1024 * 1024) {
                            alert('Không thể xử lý ảnh này. Vui lòng chọn ảnh khác có kích thước nhỏ hơn.');
                            return;
                        }
                        const resultUrl = URL.createObjectURL(compressedBlob);
                        resultImage.src = resultUrl;
                        resultSection.style.display = 'block';
                        downloadBtn.href = resultUrl;
                        downloadBtn.download = 'fixed_image.png';
                    }, 'image/png', 0.8);
                } else {
                    const resultUrl = URL.createObjectURL(blob);
                    resultImage.src = resultUrl;
                    resultSection.style.display = 'block';
                    downloadBtn.href = resultUrl;
                    downloadBtn.download = 'fixed_image.png';
                }
            }, 'image/png', 1.0);
        };
    });
}); 