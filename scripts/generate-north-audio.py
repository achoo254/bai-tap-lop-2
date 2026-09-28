"""Tạo các tệp âm thanh bản thu giọng kể chuyện chuẩn:
- Giọng Miền Bắc (Hà Nội): Sử dụng Apple Linh (chuẩn thanh điệu và ngữ điệu Hà Nội) kết hợp ffmpeg.
- Giọng Miền Nam (Sài Gòn): Sử dụng Hoài My Neural (ngữ điệu miền Nam) từ edge-tts.
"""
import asyncio
import os
import subprocess

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../apps/site/public/game/audio")

NORTHERN_ITEMS = [
    {
        "filename": "owl-greeting.mp3",
        "text": "Mến chào bé Miu thân yêu! Bác Cú đã đợi bé ở Cổng Vùng Toán từ sớm đấy. Cùng bác khám phá bí mật của những con số kỳ diệu nhé!",
    },
    {
        "filename": "story-intro.mp3",
        "text": "Ngày xửa ngày xưa, ở Thung Lũng Con Số diệu kỳ, có một chú mèo nhỏ thông minh tên là Miu. Hôm nay, Miu mang chiếc ba lô nhỏ xinh, đứng trước cánh cổng Vùng Toán rực rỡ sắc màu. Bé Miu đã sẵn sàng bước vào hành trình phiêu lưu kỳ thú chưa nào?",
    },
    {
        "filename": "reward-cheer.mp3",
        "text": "Ôi tuyệt vời làm sao! Bé Miu đã tìm ra lời giải chính xác rồi. Rương kho báu bừng sáng, và những ngôi sao vàng lấp lánh đang mỉm cười tặng thưởng cho bé kìa!",
    },
    {
        "filename": "calm-encourage.mp3",
        "text": "Không sao đâu bé ngoan! Cứ bình tĩnh thử lại một lần nữa nhé. Mỗi lần thử là một lần bé thông minh hơn một chút đấy mà. Miu cố lên nào!",
    },
    {
        "filename": "sample-north.mp3",
        "text": "Mến chào bé Miu! Đây là giọng đọc Linh chuẩn Miền Bắc Hà Nội, tròn vành rõ chữ và truyền cảm dành riêng cho bé đấy nhé!",
    },
]

SOUTHERN_ITEMS = [
    {
        "filename": "sample-south.mp3",
        "text": "Mến chào bé Miu nha! Đây là giọng đọc Hoài My ngọt ngào và dễ thương mang âm điệu miền Nam Sài Gòn dành cho bé nè!",
    },
]

def generate_northern():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for item in NORTHERN_ITEMS:
        filename = item["filename"]
        text = item["text"]
        aiff_path = f"/tmp/{filename}.aiff"
        mp3_path = os.path.join(OUTPUT_DIR, filename)
        print(f"Generating Northern voice (Linh): {filename}...")
        subprocess.run(["say", "-v", "Linh", "-r", "155", "-o", aiff_path, text], check=True)
        subprocess.run(
            ["/opt/homebrew/bin/ffmpeg", "-y", "-i", aiff_path, "-acodec", "libmp3lame", "-b:a", "128k", mp3_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        print(f"SUCCESS: {filename} ({os.path.getsize(mp3_path)} bytes)")

async def generate_southern():
    import edge_tts
    for item in SOUTHERN_ITEMS:
        filename = item["filename"]
        out_path = os.path.join(OUTPUT_DIR, filename)
        print(f"Generating Southern voice (Hoài My): {filename}...")
        comm = edge_tts.Communicate(item["text"], voice="vi-VN-HoaiMyNeural")
        await comm.save(out_path)
        print(f"SUCCESS: {filename} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    generate_northern()
    try:
        asyncio.run(generate_southern())
    except Exception as e:
        print(f"Southern edge-tts note: {e}")
