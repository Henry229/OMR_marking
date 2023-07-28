from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import io

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, world!'

@app.route('/readOMR', methods=['POST'])
def read_omr():
    data = request.get_json()
    image_data = data.get('image')

    # 이미지 데이터를 base64로 디코딩하고 NumPy 배열로 변환
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 이미지 전처리
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # 이진화
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV)

    # 마크 감지
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 마크 필터링
    marks = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if 100 < area < 500:  # 마크의 크기에 따라 이 값들을 조정해야 할 수 있습니다.
            marks.append(contour)

    # 결과를 반환
    result = {
        'status': 'success',
        'message': 'Image processed successfully',
        'data': len(marks),
        # 'data': ...  # 처리된 이미지 데이터 또는 결과를 여기에 추가
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
