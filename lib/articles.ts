import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
} from "firebase/firestore";
import { db } from "./firebase";
import { Article, ArticleCategory, Ad, Comment } from "@/types/article";

const ARTICLES_COLLECTION = "birgunjcity_articles";
const ADS_COLLECTION = "birgunjcity_ads";
const COMMENTS_COLLECTION = "birgunjcity_comments";

export async function getPublishedArticles(limitCount = 50): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    fbLimit(limitCount)
  );
  const snap = await getDocs(q);
  const now = Date.now();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Article))
    .filter((a) => !a.scheduledAt || a.scheduledAt <= now);
}

export async function getArticlesByCategory(category: ArticleCategory, limitCount = 10): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("category", "==", category),
    orderBy("createdAt", "desc"),
    fbLimit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
}

export async function getBreakingNews(): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("isBreaking", "==", true),
    orderBy("createdAt", "desc"),
    fbLimit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc"),
    fbLimit(6)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(collection(db, ARTICLES_COLLECTION), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Article;
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const q = query(collection(db, ARTICLES_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
}

export async function createArticle(data: Omit<Article, "id" | "createdAt" | "updatedAt">) {
  return addDoc(collection(db, ARTICLES_COLLECTION), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateArticle(id: string, data: Partial<Article>) {
  return updateDoc(doc(db, ARTICLES_COLLECTION, id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteArticle(id: string) {
  return deleteDoc(doc(db, ARTICLES_COLLECTION, id));
}

export async function getArticleById(id: string): Promise<Article | null> {
  const snap = await getDoc(doc(db, ARTICLES_COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Article;
}

export async function getActiveAds(position: Ad["position"]): Promise<Ad[]> {
  const q = query(
    collection(db, ADS_COLLECTION),
    where("position", "==", position),
    where("active", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ad));
}

export async function getAllAdsAdmin(): Promise<Ad[]> {
  const q = query(collection(db, ADS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ad));
}

export async function createAd(data: Omit<Ad, "id" | "createdAt">) {
  return addDoc(collection(db, ADS_COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
}

export async function deleteAd(id: string) {
  return deleteDoc(doc(db, ADS_COLLECTION, id));
}
export async function incrementViews(id: string, currentViews: number) {
  return updateDoc(doc(db, ARTICLES_COLLECTION, id), {
    views: currentViews + 1,
  });
}
export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const q = query(
    collection(db, ARTICLES_COLLECTION),
    where("status", "==", "published"),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
}
export async function getCommentsByArticle(articleId: string): Promise<Comment[]> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where("articleId", "==", articleId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}

export async function addComment(data: Omit<Comment, "id" | "createdAt">) {
  return addDoc(collection(db, COMMENTS_COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
}

export async function deleteComment(id: string) {
  return deleteDoc(doc(db, COMMENTS_COLLECTION, id));
}
const LIKES_COLLECTION = "birgunjcity_likes";

export async function hasUserLiked(articleId: string, userId: string): Promise<string | null> {
  const q = query(
    collection(db, LIKES_COLLECTION),
    where("articleId", "==", articleId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

export async function likeArticle(articleId: string, userId: string, currentLikes: number) {
  await addDoc(collection(db, LIKES_COLLECTION), { articleId, userId, createdAt: Date.now() });
  await updateDoc(doc(db, ARTICLES_COLLECTION, articleId), { likes: currentLikes + 1 });
}

export async function unlikeArticle(likeId: string, articleId: string, currentLikes: number) {
  await deleteDoc(doc(db, LIKES_COLLECTION, likeId));
  await updateDoc(doc(db, ARTICLES_COLLECTION, articleId), { likes: Math.max(0, currentLikes - 1) });
}
const BOOKMARKS_COLLECTION = "birgunjcity_bookmarks";

export async function hasUserBookmarked(articleId: string, userId: string): Promise<string | null> {
  const q = query(
    collection(db, BOOKMARKS_COLLECTION),
    where("articleId", "==", articleId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

export async function addBookmark(articleId: string, userId: string) {
  return addDoc(collection(db, BOOKMARKS_COLLECTION), { articleId, userId, createdAt: Date.now() });
}

export async function removeBookmark(bookmarkId: string) {
  return deleteDoc(doc(db, BOOKMARKS_COLLECTION, bookmarkId));
}

export async function getUserBookmarkedArticles(userId: string): Promise<Article[]> {
  const q = query(
    collection(db, BOOKMARKS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  const articleIds = snap.docs.map((d) => d.data().articleId as string);
  const articles = await Promise.all(articleIds.map((id) => getArticleById(id)));
  return articles.filter((a): a is Article => a !== null);
}
const NEWSLETTER_COLLECTION = "birgunjcity_newsletter";

export async function subscribeNewsletter(email: string) {
  return addDoc(collection(db, NEWSLETTER_COLLECTION), { email, createdAt: Date.now() });
}
export async function incrementShares(id: string, currentShares: number) {
  return updateDoc(doc(db, ARTICLES_COLLECTION, id), { shares: (currentShares || 0) + 1 });
}
const ADMINS_COLLECTION = "birgunjcity_admins";

export async function getAdminRole(email: string): Promise<"editor" | "reporter" | null> {
  const q = query(collection(db, ADMINS_COLLECTION), where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data().role as "editor" | "reporter";
}
export async function incrementAdClick(id: string) {
  const ref = doc(db, ADS_COLLECTION, id);
  const snap = await getDoc(ref);
  const current = snap.exists() ? (snap.data().clicks || 0) : 0;
  return updateDoc(ref, { clicks: current + 1 });
}
export async function getAllPublishedGroupedByCategory(limitPerCategory = 4) {
  const all = await getPublishedArticles(200);
  const grouped: Record<string, Article[]> = {};
  for (const a of all) {
    if (!grouped[a.category]) grouped[a.category] = [];
    if (grouped[a.category].length < limitPerCategory) {
      grouped[a.category].push(a);
    }
  }
  return grouped;
}
export async function getMostSharedArticles(limitCount = 5): Promise<Article[]> {
  const all = await getPublishedArticles(100);
  return all.sort((a, b) => (b.shares || 0) - (a.shares || 0)).slice(0, limitCount);
}
export async function getCommentCount(articleId: string): Promise<number> {
  const q = query(collection(db, COMMENTS_COLLECTION), where("articleId", "==", articleId));
  const snap = await getDocs(q);
  return snap.size;
}