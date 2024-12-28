import { writeFileSync } from "node:fs";
import Parser from "rss-parser";

/**
 * README.MD에 작성될 페이지 텍스트
 * @type {string}
 */
let text = `# 안녕하세요! 👋

## 저는 개발자 gghwan입니다 ✨

## Tech Stack 🛠

### Languages & Frameworks
<p>
  <img alt="" src= "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> 
  <img alt="" src= "https://img.shields.io/badge/TypeScript-black?logo=typescript&logoColor=blue"/>
</p>

## Contact Me 📫
- Blog: [trydev.tistory.com](https://trydev.tistory.com)
- GitHub: [@gghwan](https://github.com/gghwan)

## 📕 Latest Blog Posts
`;

// rss-parser 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  timeout: 5000,
});

(async () => {
  try {
    // 피드 목록
    const feed = await parser.parseURL("https://trydev.tistory.com/rss");
    console.log("피드 데이터:", feed); // 디버깅용 로그 추가
    
    if (!feed || !feed.items) {
      throw new Error("피드 데이터가 올바르지 않습니다.");
    }
    
    // 가져올 포스트 수 결정 (최대 5개)
    const postCount = Math.min(5, feed.items.length);
    
    if (postCount === 0) {
      text += "\n아직 작성된 블로그 포스트가 없습니다.";
    } else {
      // 최신 포스트의 제목과 링크를 가져온 후 text에 추가
      for (let i = 0; i < postCount; i++) {
        const { title, link } = feed.items[i];
        console.log(`${i + 1}번째 게시물`);
        console.log(`추가될 제목: ${title}`);
        console.log(`추가될 링크: ${link}`);
        text += `- [${title}](${link})\n`;
      }
    }

    // README.md 파일 작성
    writeFileSync("README.md", text, "utf8");
    console.log("README.md 업데이트 완료");
  } catch (error) {
    console.error("상세 에러 정보:", error);
    process.exit(1); // 에러 발생 시 프로세스 종료
  }
})();
