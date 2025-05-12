document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const previewSection = document.getElementById("previewSection");
    const previewImage = document.getElementById("previewImage");
    const fixButton = document.getElementById("fixButton");
    const resultSection = document.getElementById("resultSection");
    const resultImage = document.getElementById("resultImage");
    const downloadBtn = document.getElementById("downloadBtn");

    let originalFile = null;
    let currentPreviewObjectUrl = null;
    let currentResultObjectUrl = null;

    // Drag and drop handlers
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#2980b9";
    });

    dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#3498db";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#3498db";
        handleFiles(e.dataTransfer.files);
    });

    // Click to select file handler
    dropZone.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    function cleanupPreviousUrls() {
        if (currentPreviewObjectUrl) {
            URL.revokeObjectURL(currentPreviewObjectUrl);
            currentPreviewObjectUrl = null;
        }
        if (currentResultObjectUrl) {
            URL.revokeObjectURL(currentResultObjectUrl);
            currentResultObjectUrl = null;
        }
        previewImage.src = "#";
        resultImage.src = "#";
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                originalFile = file;
                cleanupPreviousUrls();
                currentPreviewObjectUrl = URL.createObjectURL(file);
                previewImage.src = currentPreviewObjectUrl;
                previewSection.style.display = "block";
                fixButton.disabled = false;
                resultSection.style.display = "none";
                resultImage.src = "#";
                downloadBtn.href = "#";
            } else {
                alert("Vui lòng chọn file ảnh!");
                originalFile = null;
                fixButton.disabled = true;
            }
        }
    }

    fixButton.addEventListener("click", async () => {
        if (!originalFile) return;

        if (currentResultObjectUrl) {
            URL.revokeObjectURL(currentResultObjectUrl);
            currentResultObjectUrl = null;
            resultImage.src = "#";
            downloadBtn.href = "#";
        }

        fixButton.disabled = true;
        fixButton.textContent = "Đang xử lý...";

        try {
            const img = new Image();
            const processObjectUrl = URL.createObjectURL(originalFile);

            img.onload = async () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let originalWidth = img.naturalWidth;
                let originalHeight = img.naturalHeight;
                const MAX_DIMENSION = 800;
                let newWidth = originalWidth;
                let newHeight = originalHeight;

                if (originalWidth > MAX_DIMENSION || originalHeight > MAX_DIMENSION) {
                    const aspectRatio = originalWidth / originalHeight;
                    if (originalWidth > originalHeight) {
                        newWidth = MAX_DIMENSION;
                        newHeight = Math.round(MAX_DIMENSION / aspectRatio);
                    } else {
                        newHeight = MAX_DIMENSION;
                        newWidth = Math.round(MAX_DIMENSION * aspectRatio);
                    }
                }
                
                // Ensure dimensions are at least 1px to avoid errors
                newWidth = Math.max(1, newWidth);
                newHeight = Math.max(1, newHeight);

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                URL.revokeObjectURL(processObjectUrl); // Revoke after drawing

                const outputMimeType = "image/png";
                const outputExtension = ".png";
                const targetMaxSizeBytes = 2 * 1024 * 1024; // 2MB

                console.log(`Resized dimensions: ${newWidth}x${newHeight}`);
                
                // For PNG, the quality parameter in toBlob is ignored by most browsers.
                // PNG is lossless, so size reduction mainly comes from dimensions and color depth reduction (not easily done with canvas basic API).
                const blob = await new Promise(resolve => canvas.toBlob(resolve, outputMimeType));
                
                console.log(`Converted to ${outputMimeType}, size: ${blob.size} bytes`);

                if (blob.size > targetMaxSizeBytes) {
                    console.warn(`Image size (${blob.size} bytes) is still > 2MB after resizing and converting to PNG.`);
                    alert(`Ảnh sau khi xử lý có dung lượng (${(blob.size / 1024 / 1024).toFixed(2)} MB) lớn hơn 2MB. Điều này có thể không đáp ứng yêu cầu của ứng dụng bạn muốn tải lên. Định dạng PNG là nén không mất dữ liệu, việc giảm thêm dung lượng mà không giảm kích thước hoặc chất lượng hình ảnh (ví dụ: giảm số màu) rất khó thực hiện trong trình duyệt.`);
                    // Even if it's too large, we still show the result for the user to decide.
                }
                
                const originalNameWithoutExtension = originalFile.name.lastIndexOf(".") > 0 ? originalFile.name.substring(0, originalFile.name.lastIndexOf(".")) : originalFile.name;
                const newFileName = originalNameWithoutExtension + "_processed" + outputExtension;
                const newFile = new File([blob], newFileName, { type: outputMimeType });

                currentResultObjectUrl = URL.createObjectURL(newFile);
                resultImage.src = currentResultObjectUrl;
                resultSection.style.display = "block";

                downloadBtn.href = currentResultObjectUrl;
                downloadBtn.download = newFile.name;

                fixButton.textContent = "Khắc phục ngay";
                fixButton.disabled = false;
            };

            img.onerror = () => {
                URL.revokeObjectURL(processObjectUrl);
                alert("Không thể tải file ảnh. File có thể bị lỗi hoặc không được hỗ trợ.");
                fixButton.textContent = "Khắc phục ngay";
                fixButton.disabled = false;
            };

            img.src = processObjectUrl;
        } catch (error) {
            console.error("Lỗi khi xử lý ảnh:", error);
            alert("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
            fixButton.textContent = "Khắc phục ngay";
            fixButton.disabled = false;
        }
    });

    window.addEventListener("beforeunload", () => {
        cleanupPreviousUrls();
    });
});

