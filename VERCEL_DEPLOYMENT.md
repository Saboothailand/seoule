# Vercel 배포 가이드 | Vercel Deployment Guide

## 🚀 Vercel 배포 단계

### 1. GitHub 저장소 준비
```bash
# Git 저장소 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 저장소 생성 후 연결
git remote add origin https://github.com/yourusername/seoule.git
git push -u origin main
```

### 2. Vercel 프로젝트 생성
1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. 환경 변수 설정
Vercel Dashboard > Project Settings > Environment Variables에서 다음 변수들을 추가:

#### 필수 환경 변수
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.foexpuvonrtdkvbdtoar.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

#### 선택적 환경 변수 (향후 확장용)
```
NEXT_PUBLIC_SUPABASE_URL=https://foexpuvonrtdkvbdtoar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. 빌드 설정 확인
Vercel이 자동으로 감지해야 하는 설정들:
- ✅ Next.js 14 App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Monorepo 구조

### 5. 배포 실행
1. Vercel Dashboard에서 "Deploy" 클릭
2. 빌드 로그 확인
3. 배포 완료 후 URL 확인

## 🔧 문제 해결

### 빌드 오류가 발생하는 경우
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제가 있다면
npm install
npm run build
```

### 환경 변수 관련 오류
- `DATABASE_URL`이 올바른지 확인
- `JWT_SECRET`이 설정되었는지 확인
- Supabase 연결이 활성화되어 있는지 확인

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성화되어 있는지 확인
- 데이터베이스 URL이 올바른지 확인
- 방화벽 설정 확인

## 📋 배포 후 확인사항

### 1. 기본 기능 테스트
- [ ] 홈페이지 로드
- [ ] 로그인 페이지 접근
- [ ] 관리자 로그인 (admin@seoule.com / admin123)
- [ ] 대시보드 접근
- [ ] 예약 목록 확인
- [ ] 새 예약 생성

### 2. 데이터베이스 연결 확인
- [ ] 고객 목록 로드
- [ ] 직원 목록 로드
- [ ] 서비스 목록 로드
- [ ] 예약 데이터 표시

### 3. 인증 시스템 확인
- [ ] 로그인/로그아웃 작동
- [ ] 보호된 페이지 접근 제어
- [ ] 세션 관리

## 🌐 도메인 설정 (선택사항)

### 커스텀 도메인 추가
1. Vercel Dashboard > Project Settings > Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 설정

### SSL 인증서
- Vercel이 자동으로 Let's Encrypt SSL 인증서 제공
- HTTPS 자동 활성화

## 📊 모니터링

### Vercel Analytics
- Vercel Dashboard에서 성능 모니터링
- 페이지 로드 시간 확인
- 오류 로그 확인

### 로그 확인
```bash
# Vercel CLI로 로그 확인 (선택사항)
npm i -g vercel
vercel logs your-project-url
```

## 🔄 업데이트 배포

### 자동 배포
- GitHub main 브랜치에 push하면 자동 배포
- Pull Request 생성 시 Preview 배포

### 수동 배포
- Vercel Dashboard에서 "Redeploy" 클릭

## 📞 지원

문제가 발생하면:
1. Vercel Dashboard의 Functions 탭에서 오류 로그 확인
2. Build Logs에서 빌드 오류 확인
3. 환경 변수 설정 재확인

---

## 🎉 배포 완료!

배포가 성공하면 다음과 같은 URL로 접근할 수 있습니다:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch.vercel.app`

### 기본 로그인 정보
- **관리자**: admin@seoule.com / admin123
- **직원**: nina@seoule.com / staff123
