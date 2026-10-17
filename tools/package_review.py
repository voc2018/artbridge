"""Package only public ArtBridge files for the existing Voice of Piece Worker."""
from pathlib import Path
import subprocess
import shutil
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT / 'tools/build_static.py')], check=True, cwd=ROOT)
output = ROOT / 'downloads/ArtBridge-blue-yellow.zip'
output.parent.mkdir(exist_ok=True)
instructions = '''ArtBridge — 선명한 색면과 지도, AB 라인 로고

Hero는 파랑·노랑·빨강·주황의 큰 면으로 다시 구성했습니다.
탄자니아와 Arusha를 아프리카 지도에, Los Angeles를 북미 지도에 표시했습니다.
사이트 헤더에는 확정한 연결형 AB 로고를 넣었습니다.
Grace와 Ezekiel의 원본 작품 세 장을 원본 픽셀 그대로 포함했습니다.
첫 방문은 영어, Hero에는 Kiswahili 문구를 함께 표시하며 한국어도 고를 수 있습니다.

기존 vop-worker 프로젝트에 적용하려면:
1. 기존 public/artbridge 폴더를 복사해 백업합니다.
2. 이 압축의 artbridge 폴더 안에 있는 파일을 기존 public/artbridge 안에 복사합니다.
3. 덮어쓰기를 확인합니다. public/artbridge/artbridge처럼 폴더가 중복되지 않았는지 확인합니다.
4. 다른 화가 디렉토리와 src, wrangler.jsonc는 그대로 둡니다.

VS Code의 vop-worker 폴더에서 터미널을 열고 실행:
py -m http.server 5500 --bind 127.0.0.1 --directory public/artbridge
브라우저 주소: http://127.0.0.1:5500/
파일을 바꾼 뒤 Ctrl+Shift+R로 새로고침합니다.

이 ZIP은 로컬 미리보기용입니다. Cloudflare에는 아직 배포하지 않았습니다.
실제 작가의 참여 의사나 현재 플랫폼 기능을 보장하는 문구는 추가하지 않았습니다.
'''
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted((ROOT / 'dist').rglob('*')):
        if path.is_file() and path.name != '404.html':
            archive.write(path, 'artbridge/' + path.relative_to(ROOT / 'dist').as_posix())
    archive.writestr('먼저 읽어주세요.txt', instructions)
shutil.copyfile(output, ROOT / 'downloads/ArtBridge-new.zip')
print(output)
