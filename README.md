# Toss 송금 QR · MVP (모바일 웹)

## 로컬 실행
```bash
npm i
npm run dev
```

## 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 배포(옵션)
### Vercel
- https://vercel.com 에서 새 프로젝트 → GitHub 저장소 연결 → 자동 빌드/배포
- 프레임워크: Vite (Auto-detect), Build Command: `npm run build`, Output: `dist`

### Netlify
- 새 사이트 → Git 연결 또는 드래그&드롭: `dist` 폴더 업로드
- Build: `npm run build`, Publish directory: `dist`

### GitHub Pages
```bash
npm i -D gh-pages
# package.json scripts에 "deploy": "gh-pages -d dist" 추가 후
npm run build && npm run deploy
```

## 주의
- `supertoss://` 스킴은 비공식입니다. OS/앱 버전에 따라 동작이 달라질 수 있습니다.
- 민감정보를 서버로 전송하지 않고 클라이언트에서만 사용하세요.
