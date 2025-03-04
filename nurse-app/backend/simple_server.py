# 標準ライブラリだけを使用した最小限のHTTPサーバー
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import time

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        # パスに基づいてレスポンスを返す
        if self.path == '/':
            response = {"message": "看護支援アプリAPIへようこそ"}
        elif self.path == '/health':
            response = {"status": "healthy"}
        elif self.path == '/api/injections':
            # ダミーデータを返す
            response = [
                {
                    "id": 1,
                    "patient_id": "P001",
                    "patient_name": "山田太郎",
                    "medication": "インスリン",
                    "dose": "10単位",
                    "route": "皮下注射",
                    "scheduled_time": "2025-03-03T10:00:00",
                    "status": "scheduled",
                    "notes": "食前に投与",
                    "created_by_id": 1,
                    "created_at": "2025-03-01T09:00:00"
                },
                {
                    "id": 2,
                    "patient_id": "P002",
                    "patient_name": "佐藤花子",
                    "medication": "抗生物質",
                    "dose": "500mg",
                    "route": "静脈注射",
                    "scheduled_time": "2025-03-03T14:00:00",
                    "status": "administered",
                    "administered_time": "2025-03-03T14:05:00",
                    "administered_by": "鈴木看護師",
                    "notes": "右腕に投与",
                    "created_by_id": 1,
                    "created_at": "2025-03-01T10:00:00",
                    "updated_by_id": 1,
                    "updated_at": "2025-03-03T14:10:00"
                }
            ]
        else:
            response = {"message": f"エンドポイント {self.path} は利用できません"}
        
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        # トークンエンドポイントの処理
        if self.path == '/token':
            response = {
                "access_token": "dummy_token_" + str(int(time.time())),
                "token_type": "bearer"
            }
        else:
            # POSTリクエストのデータをそのまま返す（エコー）
            try:
                data = json.loads(post_data.decode('utf-8'))
                # IDを追加
                data["id"] = 3
                data["created_by_id"] = 1
                data["created_at"] = "2025-03-03T15:00:00"
                response = data
            except:
                response = {"message": "データを処理できませんでした"}
        
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHandler)
    print(f"サーバーを起動しました。http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()