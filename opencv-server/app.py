from flask import Flask, request, jsonify
from flask_cors import CORS

import cv2
import numpy as np
import json
import base64
import io

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return 'Hello, world!'


@app.route('/readOMR', methods=['POST'])
def read_omr():
    data = request.get_json()
    # print('request', data)
    image_data = data.get('image')
    if ',' in image_data:
        image_data = image_data.split(',')[1]
    # data = request.files['file']
    # print('request', data)

    # 이미지 데이터를 base64로 디코딩하고 NumPy 배열로 변환
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        print("Image was not loaded properly")
        return jsonify({'error': 'Image was not loaded properly'})

    # 이미지 전처리
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # 이진화
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV)

    # 처리된 이미지를 base64로 인코딩
    is_success, im_buf_arr = cv2.imencode(".jpg", binary)
    byte_im = im_buf_arr.tobytes()
    base64_bytes = base64.b64encode(byte_im)
    base64_string = base64_bytes.decode('utf-8')

    # 마크 감지
    contours, _ = cv2.findContours(
        binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 마크 필터링
    marks = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if 100 < area < 500:  # 마크의 크기에 따라 이 값들을 조정해야 할 수 있습니다.
            marks.append(contour)
            # Get the bounding rectangle of the contour
            x, y, w, h = cv2.boundingRect(contour)
            # print(f"Mark found at x={x}, y={y}, width={w}, height={h}")

            # Draw the rectangle on the original image
            cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

     # Convert the image to JPEG
    _, jpeg_image = cv2.imencode('.jpg', img)
    # Save the image with rectangles
    # cv2.imwrite("marked_image.jpg", img)

    # Encode the image as a Base64 string
    base64_image = base64.b64encode(jpeg_image.tobytes()).decode('utf-8')

    # 결과를 반환
    result = {
        'status': 'success',
        'message': 'Image processed successfully',
        'data': len(marks),
        'image': base64_image
        # 'data': ...  # 처리된 이미지 데이터 또는 결과를 여기에 추가
    }
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
