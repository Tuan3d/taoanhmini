# Dự án Chuyển Đổi Ảnh Mini (taoanhmini)

Đây là một công cụ web đơn giản giúp bạn chuyển đổi ảnh để đáp ứng các yêu cầu cụ thể về định dạng, kích thước và dung lượng, nhằm mục đích tải lên các ứng dụng khác một cách dễ dàng.

## Tính năng chính (Phiên bản cập nhật)

-   **Chuyển đổi sang định dạng PNG:** Ảnh đầu vào sẽ được xử lý và xuất ra dưới dạng file PNG.
-   **Thay đổi kích thước tiêu chuẩn:**
    -   Nếu chiều rộng hoặc chiều cao của ảnh gốc lớn hơn 800 pixel, ảnh sẽ được tự động thu nhỏ lại.
    -   Cả chiều rộng và chiều cao của ảnh sau khi xử lý sẽ không vượt quá 800 pixel.
    -   Tỷ lệ khung hình gốc của ảnh sẽ được giữ nguyên để tránh bị méo hoặc cắt xén.
-   **Kiểm soát dung lượng file:**
    -   Công cụ cố gắng đảm bảo dung lượng file PNG đầu ra không vượt quá 2MB.
    -   **Lưu ý quan trọng:** Định dạng PNG là một định dạng nén không mất dữ liệu (lossless). Điều này có nghĩa là chất lượng hình ảnh được bảo toàn tối đa, nhưng việc giảm dung lượng file PNG một cách đáng kể (đặc biệt với những ảnh có nhiều màu sắc và chi tiết) mà không làm giảm kích thước pixel hoặc số lượng màu là rất khó khăn, nhất là trong môi trường trình duyệt. Nếu ảnh sau khi xử lý vẫn có dung lượng lớn hơn 2MB, một thông báo cảnh báo sẽ được hiển thị.
-   **Giao diện kéo thả đơn giản:** Dễ dàng tải ảnh lên bằng cách kéo thả hoặc chọn từ máy tính của bạn.
-   **Xem trước và tải xuống:** Xem trước ảnh gốc và ảnh đã xử lý, sau đó tải xuống kết quả.

## Cách sử dụng

1.  Mở file `index.html` trong trình duyệt web của bạn.
2.  Kéo và thả file ảnh bạn muốn chuyển đổi vào vùng "Kéo và thả ảnh vào đây" hoặc nhấp vào vùng đó để chọn file từ máy tính.
3.  Ảnh gốc sẽ được hiển thị ở mục xem trước.
4.  Nhấp vào nút "Khắc phục ngay".
5.  Ảnh sau khi xử lý sẽ được hiển thị ở mục kết quả.
6.  Nếu dung lượng ảnh PNG sau khi xử lý vượt quá 2MB, một cảnh báo sẽ xuất hiện.
7.  Nhấp vào nút "Tải xuống ảnh đã khắc phục" để lưu ảnh về máy.

## Mục tiêu của dự án

Dự án này được tạo ra với mục đích giúp người dùng dễ dàng điều chỉnh ảnh của mình để phù hợp với các yêu cầu của những nền tảng hoặc ứng dụng khác, đặc biệt là các yêu cầu về định dạng file (PNG), kích thước tối đa (không quá 800x800 pixels) và dung lượng tối đa (dưới 2MB).

## Lưu ý

-   Công cụ này xử lý ảnh hoàn toàn phía trình duyệt (client-side), không có ảnh nào được tải lên máy chủ.
-   Hiệu quả của việc giảm dung lượng có thể khác nhau tùy thuộc vào đặc điểm của ảnh gốc.

## Mã nguồn

-   `index.html`: Cấu trúc trang web.
-   `styles.css`: Định dạng giao diện.
-   `script.js`: Logic xử lý ảnh và tương tác người dùng.

