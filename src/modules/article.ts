const API = "https://api.alan.imdeo.kr/novel";

export interface Article {
  id: number;
  title: string;
  author: string;
  created_date: string;
  url: string;
  related_links: string[];
  prev: number | null;
  next: number | null;
  series: number | null;
}

export async function getArticleCount(): Promise<number> {
  const response = await fetch(`${API}/pages?count=1`);
  const count = await response.json();
  return count;
}

export async function getPages(articlePerPage?: number): Promise<number> {
  try {
    let url = `${API}/pages`;
    if (articlePerPage) {
      url += `?count=${articlePerPage}`;
    }
    const response = await fetch(url);
    const count: number = await response.json();
    return count;
  } catch (err) {
    throw err;
  }
}

export async function getArticles(page: number, articlePerPage?: number): Promise<Article[]> {
  try {
    let url = `${API}/list/${page}`;
    if (articlePerPage) {
      url += `?count=${articlePerPage}`;
    }
    const response = await fetch(url);
    const articles: Article[] = await response.json();
    return articles;
  } catch (err) {
    throw err;
  }
}

export async function getArticleInfo(id: number): Promise<Article> {
  try {
    const response = await fetch(`${API}/info/${id}`);
    const article: Article = await response.json();
    return article;
  } catch (err) {
    throw err;
  }
}

export function getPrettierDate(date: string): string {
  const d = new Date(date);
  return (
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` +
    " " +
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  );
}
