const API = "https://api.alan.imdeo.kr/novel";

export interface Article {
  id: number;
  title: string;
  author: string;
  created_date: string;
  url: string;
  related_links: string[];
  category: number | null;
  prev: number | null;
  next: number | null;
}

export async function getTables(): Promise<string[]> {
  const res = await fetch(`${API}/tables`);
  return await res.json();
}

export async function getArticleCount(table: string): Promise<number> {
  const response = await fetch(`${API}/pages/${table}?&count=1`);
  const count = await response.json();
  return count;
}

export async function getPages(table: string, articlePerPage?: number): Promise<number> {
  try {
    let url = `${API}/pages/${table}`;
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

export async function getArticles(table: string, page: number, articlePerPage?: number): Promise<Article[]> {
  try {
    let url = `${API}/list/${table}/${page}`;
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

export async function getArticleInfo(table: string, id: number): Promise<Article> {
  try {
    const response = await fetch(`${API}/info/${table}/${id}`);
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
