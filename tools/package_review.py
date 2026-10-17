"""Package only public ArtBridge files for the existing Voice of Piece Worker."""
from pathlib import Path
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT / 'tools/build_static.py')], check=True, cwd=ROOT)
output = ROOT / 'downloads/ArtBridge-new.zip'
output.parent.mkdir(exist_ok=True)
instructions = '''ArtBridge 새 디자인 — 로컬 확인용

압축을 풀면 artbridge 폴더 하나가 있습니다.
기존 vop-worker/public/artbridge를 별도 위치에 백업한 뒤,
이 artbridge 폴더의 내용을 기존 public/artbridge 안에 복사하고 덮어쓰세요.
폴더가 한 겹 더 생기지 않게 public/artbridge/index.html 위치를 확인하세요.
기존에 추가해 둔 작품 파일은 지우지 마세요.
다른 화가 폴더, src, wrangler.jsonc는 그대로 유지합니다.

아직 포함되지 않은 파일: 채팅에 올린 새 작품 이미지 세 장.
보이는 미리보기 이미지를 작업 파일로 가져올 수 없어 ZIP에는 들어 있지 않습니다.
예전 들소 작품을 대신 표시하지 않으며, 이미지가 없는 자리는 대기 상태로 표시합니다.
세 그림을 아래 이름으로 artbridge/assets에 넣으면 HTML 수정 없이 표시됩니다.
첫 번째(완성 콜라보): collaboration-final.png
두 번째(Grace 인물): grace-original.png
세 번째(Ezekiel 사자): ezekiel-original.png
JPG/JPEG/WebP 파일이면 원래 확장자를 유지하세요. 같은 이름의 해당 확장자도 자동으로 찾습니다.
예: collaboration-final.jpg
이미지를 재생성하거나 자르지 않고 원본 비율과 서명을 유지합니다.

VS Code에서 기존 vop-worker 폴더를 열고 터미널에서 실행:
py -m http.server 5500 --bind 127.0.0.1 --directory public/artbridge
브라우저 주소:
http://127.0.0.1:5500/
새로고침: Ctrl+Shift+R

이 패키지는 로컬 검토용입니다. 실제 Cloudflare에는 배포하지 않았습니다.
ArtBridge 데이터는 브라우저에 저장되며 자동 번역은 연결되어 있지 않습니다.
원스톱 플랫폼 소개는 비전이고, 현재 계약 문서는 검토용 초안입니다.
'''
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted((ROOT / 'dist').rglob('*')):
        if path.is_file() and path.name != '404.html':
            archive.write(path, 'artbridge/' + path.relative_to(ROOT / 'dist').as_posix())
    archive.writestr('먼저 읽어주세요.txt', instructions)
print(output)
